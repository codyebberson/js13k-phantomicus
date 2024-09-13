#version 300 es

precision mediump float;

// uniform float u_time;

// The color texture
// uniform sampler2D u_colorTexture;

uniform vec3 u_cameraPosition;

uniform vec3 u_lightPosition;
uniform vec3 u_lightDirection;

// The shadow map texture
uniform sampler2D u_depthTexture;

uniform float u_ambientLight;

// Color varying
// Simple copy of the input color
in vec4 v_color;

// World position
// Mesh position transformed to world position
in vec4 v_position;

// World normal
// Mesh normal transformed to world normal
in vec4 v_normal;

// The shadow map texture coordinate
in vec4 v_shadowMapTexCoord;

// Output color
out vec4 outputColor;

void main() {
    // Emissive
  if(v_color.r > 0.99f || v_color.g > 0.99f || v_color.b > 0.99f) {
    outputColor = v_color;
    return;
  }

  vec3 textureColor = v_color.rgb;

  // The majority of this shader is calculating light.
  // There are 4 inputs to lighting:
  // 1) Ambient - permeates the scene, not affected by direction
  // 2) Directional - light emmitted from the light source
  // 3) Specular refleciton - light bouncing directly into the camera
  //    See: http://learnwebgl.brown37.net/09_lights/lights_specular.html
  // 4) Shadows
  //    See: https://webgl2fundamentals.org/webgl/lessons/webgl-shadows.html

  // First we need to calculate the surface normal
  vec3 surfaceNormal = normalize(v_normal.xyz);

  // Shadow mapping
  // Project this fragment onto the shadow map
  vec3 projectedTexcoord = v_shadowMapTexCoord.xyz / v_shadowMapTexCoord.w;

  // The current depth (from the perspective of the light source)
  // is simply the z value of the projected coordinate.
  // Subtract a small "bias" to reduce "shadow acne"
  // float bias = 0.0f;
  // float bias = 0.000005f; // no shadow
  // float bias = 0.000003f; // no shadow
  // float bias = 0.000002f; // some shadows
  // float bias = 0.0000017f; //
  // float bias = 0.0000015f;  // acne
  // float bias = 0.000001f; // acne
  float bias = 0.0001f;
  float currentDepth = projectedTexcoord.z - bias;
  // float currentDepth = projectedTexcoord.z * 0.9999999;
  // float currentDepth = projectedTexcoord.z * 0.9999987f;

  // Make sure the projected coordinate is actually within range of the shadow map
  bool inRange = projectedTexcoord.x >= 0.0f &&
    projectedTexcoord.x <= 1.0f &&
    projectedTexcoord.y >= 0.0f &&
    projectedTexcoord.y <= 1.0f;
  float projectedCount = 0.0f;
  float closerCount = 0.0f;

  for(int projectedY = -2; projectedY <= 2; projectedY++) {
    for(int projectedX = -2; projectedX <= 2; projectedX++) {
      // Get the projected depth
      // (If out of range, this willy simply clamp to edge)
      vec4 projectedPixel = texture(u_depthTexture, projectedTexcoord.xy + vec2(projectedX, projectedY) / 1024.0f);
      float projectedDepth = projectedPixel.r;
      if(projectedDepth <= currentDepth) {
        closerCount += 1.0f;
      }
      projectedCount += 1.0f;
    }
  }

  vec3 lightToFragment = v_position.xyz - u_lightPosition;
  vec3 lightRay = normalize(v_position.xyz - u_lightPosition);
  float distanceSq = dot(lightToFragment, lightToFragment);
  float cosAngle = dot(lightRay, normalize(u_lightDirection));
  bool inCone = distanceSq < 1600.0f && cosAngle > 0.9f;

  // And now we can determine if we're in a shadow or not
  // If in a shadow, the shadow light is zero
  // Otherwise, the shadow light is one
  // float shadowLight = (inRange && projectedDepth <= currentDepth) ? 0.2 : 1.0;
  // float shadowLight = (inRange && inCone) ? 1.0f - closerCount / projectedCount : 0.0f;
  float shadowLight = 0.0f;
  if(inRange && inCone) {
    float shadowFactor = 1.0f - closerCount / projectedCount;
    float distance = sqrt(distanceSq);
    float attenuation = 1.0f / (1.0f + 0.001f * distance + 0.0003f * distanceSq);
    shadowLight = shadowFactor * attenuation;
  }

  // Directional light
  // vec3 lightNormal = normalize(vec3(-.25f, -.75f, .2f));
  // float directionalLight = max(dot(surfaceNormal, lightNormal), 0.0);
  // float directionalLight = 0.0f;
  // vec3 lightSource = vec3(256.0f, 256.0f, -128.0f);
  float directionalLight = max(0.0f, dot(lightRay, surfaceNormal));

  // Ambient directional light
  vec3 ambientLightSource = vec3(256.0f, 256.0f, -128.0f);
  vec3 ambientLightRay = normalize(v_position.xyz - ambientLightSource);
  float ambientDirectionalLight = max(0.0f, dot(ambientLightRay, surfaceNormal));

  // Light factor can be in the range of 0.0 to 2.0
  // Apply toon shading / cel shading effect
  // float lightFactor = clamp(0.5f * ambientDirectionalLight + 0.6f * directionalLight * shadowLight, 0.0f, 1.0f);
  //u_ambientLight
  float lightFactor = clamp(u_ambientLight * ambientDirectionalLight + (1.2f - u_ambientLight) * directionalLight * shadowLight, 0.0f, 1.0f);

  // Now map the light factor to a color
  // Light factor 0-1 is black to color
  vec3 surfaceColor = mix(vec3(0.0f, 0.0f, 0.0f), textureColor, lightFactor);

  // Specular light
  vec3 viewDir = normalize(u_cameraPosition - v_position.xyz);
  vec3 reflectDir = reflect(lightRay, surfaceNormal);
  float shininess = 64.0f;
  float specular = shadowLight * pow(max(dot(viewDir, reflectDir), 0.0f), shininess);
  surfaceColor = mix(surfaceColor, vec3(1.0f, 1.0f, 1.0f), specular);

  outputColor = vec4(surfaceColor.rgb, v_color.a);
}
