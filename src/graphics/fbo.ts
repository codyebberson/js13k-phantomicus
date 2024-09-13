import { HEIGHT, WIDTH, gl } from '../globals';
import {
  CLAMP_TO_EDGE,
  COLOR_ATTACHMENT0,
  DEPTH_ATTACHMENT,
  DEPTH_COMPONENT,
  DEPTH_COMPONENT32F,
  FLOAT,
  FRAMEBUFFER,
  LINEAR,
  NEAREST,
  RGBA,
  TEXTURE_2D,
  TEXTURE_MAG_FILTER,
  TEXTURE_MIN_FILTER,
  TEXTURE_WRAP_S,
  TEXTURE_WRAP_T,
  UNSIGNED_BYTE,
} from './glconstants';

export interface FBO {
  size: number;
  colorTexture: WebGLTexture;
  depthTexture: WebGLTexture;
  frameBuffer: WebGLFramebuffer;
}

/**
 * Creates a FBO.
 * @param size Size in pixels, both width and height.
 * @returns
 */
export const createFbo = (size: number): FBO => {
  const colorTexture = gl.createTexture() as WebGLTexture;
  gl.bindTexture(TEXTURE_2D, colorTexture);

  const level = 0;
  {
    // define size and format of level 0
    const internalFormat = RGBA;
    const border = 0;
    const format = RGBA;
    const type = UNSIGNED_BYTE;
    const data = null;
    gl.texImage2D(TEXTURE_2D, level, internalFormat, size, size, border, format, type, data);

    // set the filtering so we don't need mips
    gl.texParameteri(TEXTURE_2D, TEXTURE_MIN_FILTER, LINEAR);
    gl.texParameteri(TEXTURE_2D, TEXTURE_WRAP_S, CLAMP_TO_EDGE);
    gl.texParameteri(TEXTURE_2D, TEXTURE_WRAP_T, CLAMP_TO_EDGE);
  }

  const depthTexture = gl.createTexture() as WebGLTexture;
  gl.bindTexture(TEXTURE_2D, depthTexture);
  gl.texImage2D(
    TEXTURE_2D, // target
    0, // mip level
    DEPTH_COMPONENT32F,
    size, // width
    size, // height
    0, // border
    DEPTH_COMPONENT, // format
    FLOAT, // type
    null
  ); // data
  gl.texParameteri(TEXTURE_2D, TEXTURE_MAG_FILTER, NEAREST);
  gl.texParameteri(TEXTURE_2D, TEXTURE_MIN_FILTER, NEAREST);
  gl.texParameteri(TEXTURE_2D, TEXTURE_WRAP_S, CLAMP_TO_EDGE);
  gl.texParameteri(TEXTURE_2D, TEXTURE_WRAP_T, CLAMP_TO_EDGE);

  const frameBuffer = gl.createFramebuffer() as WebGLFramebuffer;
  gl.bindFramebuffer(FRAMEBUFFER, frameBuffer);
  gl.framebufferTexture2D(
    FRAMEBUFFER, // target
    COLOR_ATTACHMENT0, // attachment point
    TEXTURE_2D, // texture target
    colorTexture, // texture
    0
  ); // mip level
  gl.framebufferTexture2D(
    FRAMEBUFFER, // target
    DEPTH_ATTACHMENT, // attachment point
    TEXTURE_2D, // texture target
    depthTexture, // texture
    0
  ); // mip level

  return {
    size,
    colorTexture,
    depthTexture,
    frameBuffer,
  };
};

/**
 * Binds an FBO as the render target.
 * @param fbo
 */
export const bindFbo = (fbo: FBO): void => {
  gl.bindFramebuffer(FRAMEBUFFER, fbo.frameBuffer);
  gl.viewport(0, 0, fbo.size, fbo.size);
};

/**
 * Binds the screen as the render target.
 */
export const bindScreen = (): void => {
  gl.bindFramebuffer(FRAMEBUFFER, null);
  gl.viewport(0, 0, WIDTH, HEIGHT);
};
