import { DEBUG, log } from '../debug';
import { gl } from '../globals';
import {
  ARRAY_BUFFER,
  COMPILE_STATUS,
  FLOAT,
  FRAGMENT_SHADER,
  LINK_STATUS,
  STATIC_DRAW,
  VERTEX_SHADER,
} from './glconstants';
import {
  ATTRIBUTE_COLOR,
  ATTRIBUTE_NORMAL,
  ATTRIBUTE_POSITION,
  ATTRIBUTE_WORLDMATRIX,
  BLOOM_FRAG,
  BLOOM_VERT,
  MAIN_FRAG,
  MAIN_VERT,
  POST_FRAG,
  POST_VERT,
  SHADOW_FRAG,
  SHADOW_VERT,
  UNIFORM_AMBIENTLIGHT,
  UNIFORM_BLOOMTEXTURE,
  UNIFORM_CAMERAPOSITION,
  UNIFORM_COLORTEXTURE,
  UNIFORM_DEPTHTEXTURE,
  UNIFORM_ITERATION,
  UNIFORM_LIGHTDIRECTION,
  UNIFORM_LIGHTPOSITION,
  UNIFORM_PROJECTIONMATRIX,
  UNIFORM_SHADOWMAPMATRIX,
  UNIFORM_VIEWMATRIX,
} from './shaders';

//
// Standard input attributes for "geometry" programs.
// These are programs that render geometry.
// This works because main.vert and shadow.vert have the same attributes.
// See the use of `layout(location = 0)` in the shaders.
//

export const positionAttrib = 0;
export const colorAttrib = 1;
export const normalAttrib = 2;
export const worldMatrixAttrib = 3; // Must be last!  Matrices are multiple attributes

//
// Standard input attributes for "post-processing" programs.
// These are programs that render to the screen.
// This works because post.vert and bloom.vert have the same attributes.
// See the use of `layout(location = 0)` in the shaders.
//

export const postProcessingPositionAttrib = 0;
export const postProcessingTexCoordAttrib = 1;

/**
 * Returns the uniform location.
 * This is a simple wrapper, but helps with compression.
 * @param program
 * @param name
 * @returns The uniform location.
 */
export const getUniform = (program: WebGLProgram, name: string): WebGLUniformLocation => {
  return gl.getUniformLocation(program, name) as WebGLUniformLocation;
};

/**
 * Creates a shader.
 * @param type
 * @param source
 * @returns
 */
export const loadShader = (type: number, source: string): WebGLShader => {
  const shader = gl.createShader(type) as WebGLShader;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (DEBUG) {
    const compiled = gl.getShaderParameter(shader, COMPILE_STATUS);
    log(`Shader compiled: ${compiled}`);
    if (!compiled) {
      const compilationLog = gl.getShaderInfoLog(shader);
      log(`Shader compiler log: ${compilationLog}`);
      log(`Shader source: ${source}`);
    }
  }

  return shader;
};

/**
 * Creates the WebGL program.
 * Basic WebGL setup
 * https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL
 * @param vertexShaderSource
 * @param fragmentShaderSource
 */
export const initShaderProgram = (
  vertexShaderSource: string,
  fragmentShaderSource: string,
  bindAttribs?: boolean
): WebGLProgram => {
  const vertexShader = loadShader(VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = loadShader(FRAGMENT_SHADER, fragmentShaderSource);
  const program = gl.createProgram() as WebGLProgram;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  if (bindAttribs) {
    gl.bindAttribLocation(program, positionAttrib, ATTRIBUTE_POSITION);
    gl.bindAttribLocation(program, colorAttrib, ATTRIBUTE_COLOR);
    gl.bindAttribLocation(program, normalAttrib, ATTRIBUTE_NORMAL);
    gl.bindAttribLocation(program, worldMatrixAttrib, ATTRIBUTE_WORLDMATRIX);
  }

  gl.linkProgram(program);

  if (DEBUG) {
    const compiled = gl.getProgramParameter(program, LINK_STATUS);
    log(`Program compiled: ${compiled}`);
    const compilationLog = gl.getProgramInfoLog(program);
    log(`Program compiler log: ${compilationLog}`);
  }

  return program;
};

//
// Shadow program
// Renders geometry from the perspective of the light.
// Renders to a depth buffer for shadow mapping.
//

export const shadowProgram = initShaderProgram(SHADOW_VERT, SHADOW_FRAG);
export const shadowViewMatrixUniform = getUniform(shadowProgram, UNIFORM_VIEWMATRIX);
export const shadowProjectionMatrixUniform = getUniform(shadowProgram, UNIFORM_PROJECTIONMATRIX);

//
// Main program
// Primary renderer from the perspective of the camera.
// Renders to a color buffer and a depth buffer.
//

export const mainProgram = initShaderProgram(MAIN_VERT, MAIN_FRAG);
export const mainViewMatrixUniform = getUniform(mainProgram, UNIFORM_VIEWMATRIX);
export const mainProjectionMatrixUniform = getUniform(mainProgram, UNIFORM_PROJECTIONMATRIX);
export const mainShadowMapMatrixUniform = getUniform(mainProgram, UNIFORM_SHADOWMAPMATRIX);
export const mainDepthTextureSamplerUniform = getUniform(mainProgram, UNIFORM_DEPTHTEXTURE);
export const mainAmbientLightUniform = getUniform(mainProgram, UNIFORM_AMBIENTLIGHT);
export const mainCameraPositionUniform = getUniform(mainProgram, UNIFORM_CAMERAPOSITION);
export const mainLightPositionUniform = getUniform(mainProgram, UNIFORM_LIGHTPOSITION);
export const mainLightDirectionUniform = getUniform(mainProgram, UNIFORM_LIGHTDIRECTION);

//
// Bloom program
// Renders the glow / bloom effect.
//

export const bloomProgram = initShaderProgram(BLOOM_VERT, BLOOM_FRAG);
export const bloomColorTextureUniform = getUniform(bloomProgram, UNIFORM_COLORTEXTURE);
export const bloomIterationUniform = getUniform(bloomProgram, UNIFORM_ITERATION);

//
// Depth of field program
// Renders the depth of field effect.
//

export const depthOfFieldProgram = initShaderProgram(POST_VERT, POST_FRAG);
export const depthOfFieldColorTextureUniform = getUniform(depthOfFieldProgram, UNIFORM_COLORTEXTURE);
export const depthOfFieldDepthTextureUniform = getUniform(depthOfFieldProgram, UNIFORM_DEPTHTEXTURE);
export const depthOfFieldBloomTextureUniform = getUniform(depthOfFieldProgram, UNIFORM_BLOOMTEXTURE);
// export const depthOfFieldFocusNearUniform = getUniform(depthOfFieldProgram, UNIFORM_FOCUSNEAR);
// export const depthOfFieldFocusFarUniform = getUniform(depthOfFieldProgram, UNIFORM_FOCUSFAR);

//
// Post processing buffers
// These are the buffers used for post processing effects.
// Shared for Bloom and Depth of Field.
//

export const postProcessingVao = gl.createVertexArray() as WebGLVertexArrayObject;
gl.bindVertexArray(postProcessingVao);

/**
 * Position coordinates buffer.
 * This is the static, flat, two triangle (one quad) buffer
 * that is used for post processing effects.
 */
const postProcessingPositionBuffer = gl.createBuffer() as WebGLBuffer;
gl.bindBuffer(ARRAY_BUFFER, postProcessingPositionBuffer);
gl.bufferData(
  ARRAY_BUFFER,
  new Float32Array([
    // Top-left
    -1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
    // Bottom-right
    1.0, -1.0, 1.0, 1.0, -1.0, 1.0,
  ]),
  STATIC_DRAW
);
gl.enableVertexAttribArray(postProcessingPositionAttrib);
gl.vertexAttribPointer(postProcessingPositionAttrib, 2, FLOAT, false, 0, 0);

/**
 * Texture coordinates buffer.
 * This is the static, flat, two triangle (one quad) buffer
 * that is used for post processing effects.
 */
const postProcessingTextureBuffer = gl.createBuffer() as WebGLBuffer;
gl.bindBuffer(ARRAY_BUFFER, postProcessingTextureBuffer);
gl.bufferData(
  ARRAY_BUFFER,
  new Float32Array([
    // Top-left
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
    // Bottom-right
    1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
  ]),
  STATIC_DRAW
);
gl.enableVertexAttribArray(postProcessingTexCoordAttrib);
gl.vertexAttribPointer(postProcessingTexCoordAttrib, 2, FLOAT, false, 0, 0);
