float influence = smoothstep(0.25, 0.0, dist);

// Medium controlled shatter
vec3 explode = aRandom * influence * uHover * 1.0;

// Very subtle float
float floatMotion = sin(uTime * 0.6 + aOffset * 4.0) * 0.03;