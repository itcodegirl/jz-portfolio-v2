// ============================================================
// S3 — Micro Shard Fragment Shader
// Premium Editorial Portfolio Edition
// ============================================================

uniform sampler2D uTexture;
uniform float uTime;
uniform float uShimmerIntensity;
uniform float uRefractionStrength;

varying vec2 vUv;
varying float vShimmer;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {

    // Shimmer noise
    float noise = rand(vUv * 1200.0);

    // Chromatic refraction vector
    vec2 refract = (vUv - 0.5) * uRefractionStrength * vShimmer;

    vec4 base = texture2D(uTexture, vUv + refract);
    vec4 r = texture2D(uTexture, vUv + refract * 1.8);
    vec4 b = texture2D(uTexture, vUv - refract * 1.8);

    // Refractive RGB recombination
    vec3 color = vec3(r.r, base.g, b.b);

    // Add shimmer sparkle
    float shimmer = noise * vShimmer * uShimmerIntensity;
    color += shimmer * 0.25;

    gl_FragColor = vec4(color, 1.0);
}