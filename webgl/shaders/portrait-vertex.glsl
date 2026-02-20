// ============================================================
// S3 — Micro Shard Vertex Shader
// Premium Editorial Portfolio Edition
// ============================================================

uniform float uTime;
uniform float uHover;
uniform vec2 uMouse;

attribute float aRandom;
attribute vec3 aCluster;

varying vec2 vUv;
varying float vShimmer;

void main() {
    vUv = uv;

    // Distance to mouse in UV space
    float dist = distance(uv, uMouse);

    // Smooth falloff — only near the cursor
    float influence = smoothstep(0.35, 0.0, dist) * uHover;

    // Shard position
    vec3 pos = position;

    // Cluster displacement = micro-shard lift
    pos += aCluster * influence * 0.55;

    // "Breathing" motion — subtle oscillation
    pos.z += sin(uTime * 1.4 + aRandom * 6.0) * 0.12;

    vShimmer = influence;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}