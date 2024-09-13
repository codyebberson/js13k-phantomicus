import { HEIGHT, WIDTH, gl, overlayCtx } from '../globals';
import {
  createMat4,
  identityMat4,
  multiplyMat4,
  perspectiveMat4,
  rotateXMat4,
  rotateYMat4,
  scaleMat4,
  translateMat4,
  translateMat4Vec3,
} from '../math/mat4';
import { createVec3, negateVec3 } from '../math/vec3';
import { Camera, createCamera } from './camera';
import { DrawList } from './drawlist';
import { bindFbo, bindScreen, createFbo } from './fbo';
import { buildCube, buildSphere } from './geometry';
import {
  BLEND,
  COLOR_BUFFER_BIT,
  CULL_FACE,
  DEPTH_BUFFER_BIT,
  DEPTH_TEST,
  DYNAMIC_DRAW,
  LEQUAL,
  ONE_MINUS_SRC_ALPHA,
  SRC_ALPHA,
  STATIC_DRAW,
  TEXTURE0,
  TEXTURE1,
  TEXTURE2,
  TEXTURE_2D,
  TRIANGLES,
} from './glconstants';
import {
  bloomColorTextureUniform,
  bloomIterationUniform,
  bloomProgram,
  depthOfFieldBloomTextureUniform,
  depthOfFieldColorTextureUniform,
  depthOfFieldDepthTextureUniform,
  depthOfFieldProgram,
  mainAmbientLightUniform,
  mainCameraPositionUniform,
  mainDepthTextureSamplerUniform,
  mainLightDirectionUniform,
  mainLightPositionUniform,
  mainProgram,
  mainProjectionMatrixUniform,
  mainShadowMapMatrixUniform,
  mainViewMatrixUniform,
  postProcessingVao,
  shadowProgram,
  shadowProjectionMatrixUniform,
  shadowViewMatrixUniform,
} from './programs';

const MAIN_FBO_SIZE = 1024;
const BLOOM_FBO_SIZE = 512;

export const camera = createCamera();
export const lightSource = createCamera();
export const projectionMatrix = createMat4();
export const modelViewMatrix = createMat4();

const cameraTranslate = createVec3();
const pitchMatrix = createMat4();
const yawMatrix = createMat4();
const shadowMapMatrix = createMat4();

const cubeGeometry = buildCube();
const sphereGeometry = buildSphere();

export const drawLists = [
  new DrawList(STATIC_DRAW, cubeGeometry, 4096),
  new DrawList(STATIC_DRAW, sphereGeometry, 4096),
  new DrawList(DYNAMIC_DRAW, cubeGeometry, 4096),
  new DrawList(DYNAMIC_DRAW, sphereGeometry, 4096),
];

const shadowFbo = createFbo(MAIN_FBO_SIZE);
const mainFbo = createFbo(MAIN_FBO_SIZE);
const pingPongFbo1 = createFbo(BLOOM_FBO_SIZE);
const pingPongFbo2 = createFbo(BLOOM_FBO_SIZE);

export const resetBuffers = (usage: number): void => {
  for (const b of drawLists) {
    if (b.usage === usage) {
      b.resetBuffers();
    }
  }
};

export const updateBuffers = (usage: number): void => {
  for (const b of drawLists) {
    if (b.usage === usage) {
      b.updateBuffers();
    }
  }
};

/**
 * Starts a new frame.
 * Clears the overlay canvas and resets the dynamic drawLists.
 */
export const startFrame = (): void => {
  // Reset overlay canvas
  overlayCtx.clearRect(0, 0, WIDTH, HEIGHT);
  overlayCtx.textBaseline = 'top';

  // Reset the dynamic drawLists
  resetBuffers(DYNAMIC_DRAW);
};

/**
 * Ends the current frame.
 * Updates the dynamic drawLists and renders the scene.
 */
export const endFrame = (): void => {
  // Update buffer data
  updateBuffers(DYNAMIC_DRAW);

  // Draw the scene twice
  // First, draw from the POV of the light
  bindFbo(shadowFbo);
  resetGl();
  setupCamera(lightSource, shadowFbo.size, shadowFbo.size);
  gl.useProgram(shadowProgram);
  gl.uniformMatrix4fv(shadowProjectionMatrixUniform, false, projectionMatrix);
  gl.uniformMatrix4fv(shadowViewMatrixUniform, false, modelViewMatrix);
  renderScene();

  // Build the texture matrix that maps the world space to the depth texture
  identityMat4(shadowMapMatrix);
  translateMat4(shadowMapMatrix, shadowMapMatrix, 0.5, 0.5, 0.5);
  scaleMat4(shadowMapMatrix, shadowMapMatrix, 0.5, 0.5, 0.5);
  multiplyMat4(shadowMapMatrix, shadowMapMatrix, projectionMatrix);
  multiplyMat4(shadowMapMatrix, shadowMapMatrix, modelViewMatrix);

  // Second, draw the scene from the POV of the camera
  // Use the shadow map for lighting
  bindFbo(mainFbo);
  // bindScreen();
  resetGl();
  setupCamera(camera, WIDTH, HEIGHT);
  gl.useProgram(mainProgram);
  gl.uniformMatrix4fv(mainProjectionMatrixUniform, false, projectionMatrix);
  gl.uniformMatrix4fv(mainViewMatrixUniform, false, modelViewMatrix);
  gl.uniformMatrix4fv(mainShadowMapMatrixUniform, false, shadowMapMatrix);
  gl.uniform3fv(mainCameraPositionUniform, camera.source);
  gl.uniform3fv(mainLightPositionUniform, lightSource.source);
  gl.uniform3fv(mainLightDirectionUniform, lightSource.direction);
  gl.activeTexture(TEXTURE0);
  gl.bindTexture(TEXTURE_2D, shadowFbo.depthTexture);
  gl.uniform1i(mainDepthTextureSamplerUniform, 0);
  gl.uniform1f(mainAmbientLightUniform, lightSource.ambientLight);
  renderScene();

  // Second, draw the scene projecting the depth tecture
  // Use the ping pong technique to render back and forth between two FBOs
  // 6 iteration process:
  //  0 = filter for emissive pixels
  //  1 and 3 = blur horizontally
  //  2 and 4 = blur vertically
  //  5 = result to output
  let inputFbo = mainFbo;
  let outputFbo = pingPongFbo1;
  gl.useProgram(bloomProgram);
  for (let i = 0; i < 5; i++) {
    bindFbo(outputFbo);
    resetGl();
    gl.bindVertexArray(postProcessingVao);
    gl.activeTexture(TEXTURE0);
    gl.bindTexture(TEXTURE_2D, inputFbo.colorTexture);
    gl.uniform1i(bloomColorTextureUniform, 0);
    gl.uniform1i(bloomIterationUniform, i);
    gl.drawArrays(TRIANGLES, 0, 6);

    // Swap buffers
    if (i % 2 === 0) {
      inputFbo = pingPongFbo1;
      outputFbo = pingPongFbo2;
    } else {
      inputFbo = pingPongFbo2;
      outputFbo = pingPongFbo1;
    }
  }

  // Lastly, draw the post-processing effects
  // This includes the adding the bloom blur
  // and the depth-of-field blur
  bindScreen();
  gl.useProgram(depthOfFieldProgram);
  gl.clearColor(0, 0, 0, 1.0);
  gl.clear(COLOR_BUFFER_BIT | DEPTH_BUFFER_BIT);
  gl.bindVertexArray(postProcessingVao);
  gl.activeTexture(TEXTURE0);
  gl.bindTexture(TEXTURE_2D, mainFbo.colorTexture);
  gl.uniform1i(depthOfFieldColorTextureUniform, 0);
  gl.activeTexture(TEXTURE1);
  gl.bindTexture(TEXTURE_2D, mainFbo.depthTexture);
  gl.uniform1i(depthOfFieldDepthTextureUniform, 1);
  gl.activeTexture(TEXTURE2);
  gl.bindTexture(TEXTURE_2D, pingPongFbo1.colorTexture);
  gl.uniform1i(depthOfFieldBloomTextureUniform, 2);
  // gl.uniform1f(depthOfFieldFocusNearUniform, camera.near);
  // gl.uniform1f(depthOfFieldFocusFarUniform, camera.far);
  gl.drawArrays(TRIANGLES, 0, 6);
};

/**
 * Render the scene using the current camera and drawLists.
 */
const renderScene = (): void => {
  for (const b of drawLists) {
    b.render();
  }
};

/**
 * Resets the WebGL state for a new render.
 * Clears color buffer and depth buffer.
 */
const resetGl = (): void => {
  gl.clearColor(0, 0, 0, 1);
  gl.clear(COLOR_BUFFER_BIT | DEPTH_BUFFER_BIT);
  gl.enable(CULL_FACE);
  gl.enable(DEPTH_TEST);
  gl.depthFunc(LEQUAL);
  gl.enable(BLEND);
  gl.blendFunc(SRC_ALPHA, ONE_MINUS_SRC_ALPHA);
};

/**
 * Sets up the game camera.
 * @param camera
 * @param w Viewport width.
 * @param h Viewport height.
 */
const setupCamera = (camera: Camera, w: number, h: number): void => {
  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  const aspect = w / h;
  const zNear = 0.1;
  const zFar = 1000.0;
  perspectiveMat4(projectionMatrix, camera.fov, aspect, zNear, zFar);

  // Rotate around the X-axis by the pitch
  rotateXMat4(pitchMatrix, identityMat4(pitchMatrix), camera.pitch);

  // Rotate around the Y-axis by the yaw
  rotateYMat4(yawMatrix, identityMat4(yawMatrix), -camera.yaw);

  // Combine the pitch and yaw transformations
  multiplyMat4(modelViewMatrix, pitchMatrix, yawMatrix);

  // Finally, translate the world the opposite of the camera position
  // subtractVec3(cameraTranslate, origin, camera.source);
  negateVec3(cameraTranslate, camera.source);
  translateMat4Vec3(modelViewMatrix, modelViewMatrix, cameraTranslate);
};
