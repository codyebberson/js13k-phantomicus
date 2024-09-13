#version 300 es

precision mediump float;

// Position attribute
// Represents a position on the geometry
// In the original unit-space
// layout(location = 0)
in vec4 a_position;

// Color attribute.
// The raw color is passed in as a 32-bit unsigned integer /
// 4 unsigned bytes.
// layout(location = 1) in vec4 a_color;

// Normal attribute
// Represents the normal of the geometry
// In the original unit-space
// layout(location = 2) in vec4 a_normal;

// World transformation matrix
// One matrix per instance
// We need to use the `layout(location = 3)` directive to specify the location of the attribute
// Because this shader does not use the `a_color` and `a_normal` attributes
layout(location = 3) in mat4 a_worldMatrix;

// Camera projection uniform
uniform mat4 u_projectionMatrix;

// Camera view uniform
uniform mat4 u_viewMatrix;

void main() {
  gl_Position = u_projectionMatrix * u_viewMatrix * a_worldMatrix * a_position;
}
