#version 300 es

precision mediump float;

// The input color pixels
// On the first iteration, this is the output of the main shader
// On each following iteration, this is the output of the previous iteration.
uniform sampler2D u_colorTexture;

// The temporary working texture used during bloom ping pong
// On the first iteration, this is undefined
// On each following iteration, this is the output of the previous iteration.
// uniform sampler2D u_tempTexture;

// The current iteration
// 0 = first iteration, filter for emissive pixels
// 1 and 3 = blur horizontally
// 2 and 4 = blur vertically
uniform int u_iteration;

// uniform sampler2D u_depthTexture;

// Camera "focus" is defined by a near and far distance.
// Everything between the near and far distance are "in focus" (i.e., sharp).
// Everything closer than the near distance, or farther than the far distance,
// are gradually blurred more and more.
// uniform float u_focusNear;
// uniform float u_focusFar;

in vec2 v_texCoord;

out vec4 outputColor;

// The "emissive" threshold
// If any of the rgb values are greater than this threshold,
// then we assume the pixel/material to be emissive for the bloom shader.
// 0.99 * 255 = 252.45
// So in practive, if any channel is 253 or higher, the pixel is emissive.
float threshold = 0.99f;

// float weights[11];
float weights[11] = float[11](0.01f, 0.02f, 0.04f, 0.08f, 0.16f, 0.38f, 0.16f, 0.08f, 0.04f, 0.02f, 0.01f);

void main() {
  if(u_iteration == 0) {
    // First pass, filter for emissive pixels
    // Normally, "emissive" would be an additional property on a material
    // We use a hack of "any pixel with rgb > 0.99 is emissive"
    // Discard non-emissive pixels
    vec4 color = texture(u_colorTexture, v_texCoord);
    if(max(color.r, max(color.g, color.b)) > threshold) {
      outputColor = color;
    } else {
      discard;
    }
  } else {
    // Subsequent passes, do the bloom blur
    // On odd passes, do horizontal blurring
    // On even passes, do vertical blurring
    vec4 result = vec4(0);
    float sum = 0.0f;
    for(int xi = -5; xi <= 5; xi++) {
      vec2 delta = u_iteration % 2 == 1 ? vec2(float(xi) / 512.0f, 0.0f) : vec2(0.0f, float(xi) / 512.0f);
      vec4 color = texture(u_colorTexture, v_texCoord + delta);
      result.rgb += weights[xi + 5] * color.rgb * color.a;
      sum += weights[xi + 5] * color.a;
    }
    outputColor = sum == 0.0f ? vec4(0, 0, 0, 1) : vec4(result.rgb / sum, sum);
  }
}
