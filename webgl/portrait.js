export const PortraitWebGL = (() => {

	let container, scene, camera, renderer;
	let mesh, material, geometry, portraitTexture;

	let DeviceRef;

	// --------------------------------------------------
	// PUBLIC INIT
	// --------------------------------------------------
	async function init(device) {

		DeviceRef = device;

		container = document.getElementById("portrait-container");
		if (!container) return;

		if (!DeviceRef.canUseWebGLPortrait) {
			loadFallback();
			return;
		}

		initScene();
		portraitTexture = await loadTexture();
		buildMesh();
		addEvents();
		animate();
	}

	// --------------------------------------------------
	// FALLBACK
	// --------------------------------------------------
	function loadFallback() {
		const img = document.createElement("img");
		img.src = DeviceRef.isMobile
			? "assets/images/Jenna_robot_1_mobile.jpg"
			: "assets/images/Jenna_robot_1.jpg";

		img.className = "portrait-static";
		container.appendChild(img);
	}

	// --------------------------------------------------
	// LOAD TEXTURE
	// --------------------------------------------------
	function loadTexture() {
		return new Promise(resolve => {
			const loader = new THREE.TextureLoader();
			const src = DeviceRef.isMobile
				? "assets/images/Jenna_robot_1_mobile.jpg"
				: "assets/images/Jenna_robot_1.jpg";

			loader.load(src, tex => resolve(tex));
		});
	}

	// --------------------------------------------------
	// INIT SCENE
	// --------------------------------------------------
	function initScene() {

		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera(
			45,
			container.clientWidth / container.clientHeight,
			0.1,
			1000
		);

		camera.position.z = 30;

		renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true
		});

		renderer.setSize(container.clientWidth, container.clientHeight);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		container.appendChild(renderer.domElement);

		window.addEventListener("resize", () => {
			camera.aspect = container.clientWidth / container.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(container.clientWidth, container.clientHeight);
		});
	}

	// --------------------------------------------------
	// BUILD MESH (RESTORED WORKING VERSION)
	// --------------------------------------------------
	function buildMesh() {

		geometry = new THREE.PlaneGeometry(16, 22, 60, 80);

		const count = geometry.attributes.position.count;

		const randoms = new Float32Array(count * 3);
		const offsets = new Float32Array(count);

		for (let i = 0; i < count; i++) {

			randoms[i * 3] = (Math.random() - 0.5) * 1.5;
			randoms[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
			randoms[i * 3 + 2] = Math.random() * 1.2;

			offsets[i] = Math.random();
		}

		geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 3));
		geometry.setAttribute("aOffset", new THREE.BufferAttribute(offsets, 1));

		material = new THREE.ShaderMaterial({
			uniforms: {
				uTexture: { value: portraitTexture },
				uMouse: { value: new THREE.Vector2(0.5, 0.5) },
				uHover: { value: 0 },
				uTime: { value: 0 }
			},
			vertexShader: `
				uniform vec2 uMouse;
				uniform float uHover;
				uniform float uTime;

				attribute vec3 aRandom;
				attribute float aOffset;

				varying vec2 vUv;
				varying float vDist;

				void main() {

					vUv = uv;

					vec3 pos = position;

					float dist = distance(uv, uMouse);
					vDist = dist;

					float influence = smoothstep(0.22, 0.0, dist);

					vec3 lift = aRandom * influence * uHover * 0.25;

					float floatZ = sin(uTime * 0.6 + aOffset * 4.0) * 0.02;

					pos += lift;
					pos.z += floatZ * uHover;

					gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
				}
			`,
			fragmentShader: `
				uniform sampler2D uTexture;
				uniform float uHover;
				uniform float uTime;

				varying vec2 vUv;
				varying float vDist;

				void main() {

					vec2 uv = vUv;

					float influence = smoothstep(0.4, 0.0, vDist) * uHover;

					vec2 refractOffset = (uv - 0.5) * 0.003 * influence;

					vec4 base = texture2D(uTexture, uv + refractOffset);

					vec4 r = texture2D(uTexture, uv + refractOffset * 1.4);
					vec4 g = texture2D(uTexture, uv);
					vec4 b = texture2D(uTexture, uv - refractOffset * 1.4);

					vec3 glassColor = vec3(r.r, g.g, b.b);

					vec3 color = mix(base.rgb, glassColor, influence * 0.25);

					float sweep = smoothstep(0.2, 0.8, vUv.y + sin(uTime * 0.4) * 0.1);
					color += sweep * influence * 0.06;

					gl_FragColor = vec4(color, 1.0);
				}
			`,
			transparent: true
		});

		mesh = new THREE.Mesh(geometry, material);
		scene.add(mesh);
	}

	// --------------------------------------------------
	// EVENTS
	// --------------------------------------------------
	function addEvents() {

		container.addEventListener("mousemove", (e) => {

			const rect = container.getBoundingClientRect();

			const x = (e.clientX - rect.left) / rect.width;
			const y = 1.0 - (e.clientY - rect.top) / rect.height;

			material.uniforms.uMouse.value.set(x, y);
			material.uniforms.uHover.value = 1;
		});

		container.addEventListener("mouseleave", () => {
			material.uniforms.uHover.value = 0;
		});
	}

	// --------------------------------------------------
	// ANIMATE
	// --------------------------------------------------
	function animate() {

		requestAnimationFrame(animate);

		material.uniforms.uTime.value += 0.01;

		renderer.render(scene, camera);
	}

	return { init };

})();