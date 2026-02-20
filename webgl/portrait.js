// ============================================================
// S3 Premium Micro-Shards Portrait Engine
// ============================================================

export const PortraitWebGL = (() => {

	let container, scene, camera, renderer;
	let mesh, material, geometry, portraitTexture;
	let uniforms = {};

	const WIDTH_SEGMENTS = 180;
	const HEIGHT_SEGMENTS = 220;

	let DeviceRef;

	// ----------------------------------------
	// PUBLIC INIT
	// ----------------------------------------
	async function init(device) {

		DeviceRef = device;

		container = document.getElementById("portrait-container");
		if (!container) return;

		// If device not eligible → fallback
		if (!DeviceRef.canUseWebGLPortrait) {
			loadFallback();
			return;
		}

		initScene();

		portraitTexture = await loadTexture();
		const vertexShader = await loadShader("./src/webgl/shaders/portrait-vertex.glsl");
		const fragmentShader = await loadShader("./src/webgl/shaders/portrait-fragment.glsl");

		buildMesh(vertexShader, fragmentShader);
		addEvents();
		animate();
	}

	// ----------------------------------------
	// FALLBACK
	// ----------------------------------------
	function loadFallback() {
		const img = document.createElement("img");
		img.src = DeviceRef.isMobile
			? "assets/images/Jenna_robot_1_mobile.jpg"
			: "assets/images/Jenna_robot_1.jpg";

		img.className = "portrait-static";
		container.appendChild(img);

		gsap.from(img, { opacity: 0, duration: 1.2 });
	}

	// ----------------------------------------
	// LOAD TEXTURE
	// ----------------------------------------
	function loadTexture() {
		return new Promise(resolve => {
			const loader = new THREE.TextureLoader();

			const src = DeviceRef.isMobile
				? "assets/images/Jenna_robot_1_mobile.jpg"
				: "assets/images/Jenna_robot_1.jpg";

			loader.load(src, tex => resolve(tex));
		});
	}

	// ----------------------------------------
	// LOAD SHADER
	// ----------------------------------------
	async function loadShader(path) {
		const res = await fetch(path);
		return await res.text();
	}

	// ----------------------------------------
	// INIT SCENE
	// ----------------------------------------
	function initScene() {
		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera(
			38,
			container.clientWidth / container.clientHeight,
			0.1,
			200
		);

		camera.position.z = 28;

		renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		renderer.setSize(container.clientWidth, container.clientHeight);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));

		container.appendChild(renderer.domElement);
	}

	// ----------------------------------------
	// BUILD MESH
	// ----------------------------------------
	function buildMesh(vs, fs) {

		geometry = new THREE.PlaneGeometry(
			16, 22, WIDTH_SEGMENTS, HEIGHT_SEGMENTS
		);

		addShardAttributes();

		uniforms = {
			uTexture: { value: portraitTexture },
			uTime: { value: 0 },
			uMouse: { value: new THREE.Vector2(0.5, 0.5) },
			uHover: { value: 0 },
			uShimmerIntensity: { value: 0.8 },
			uRefractionStrength: { value: 0.015 }
		};

		material = new THREE.ShaderMaterial({
			uniforms,
			vertexShader: vs,
			fragmentShader: fs,
			transparent: true,
			side: THREE.DoubleSide
		});

		mesh = new THREE.Mesh(geometry, material);
		scene.add(mesh);

		gsap.from(mesh.scale, {
			x: 0.75,
			y: 0.75,
			duration: 1.2,
			ease: "power3.out"
		});
	}

	// ----------------------------------------
	// SHARD ATTRIBUTES
	// ----------------------------------------
	function addShardAttributes() {
		const count = geometry.attributes.position.count;

		const aRandom = new Float32Array(count);
		const aCluster = new Float32Array(count * 3);

		for (let i = 0; i < count; i++) {
			aRandom[i] = Math.random();

			aCluster[i * 3] = (Math.random() - 0.5) * 0.8;
			aCluster[i * 3 + 1] = (Math.random() - 0.5) * 0.8;
			aCluster[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
		}

		geometry.setAttribute("aRandom", new THREE.BufferAttribute(aRandom, 1));
		geometry.setAttribute("aCluster", new THREE.BufferAttribute(aCluster, 3));
	}

	// ----------------------------------------
	// EVENTS
	// ----------------------------------------
	function addEvents() {
		container.addEventListener("mousemove", e => {
			const rect = container.getBoundingClientRect();
			const x = (e.clientX - rect.left) / rect.width;
			const y = 1 - (e.clientY - rect.top) / rect.height;

			uniforms.uMouse.value.set(x, y);
			gsap.to(uniforms.uHover, { value: 1, duration: 0.4 });
		});

		container.addEventListener("mouseleave", () => {
			gsap.to(uniforms.uHover, { value: 0, duration: 0.6 });
		});
	}

	// ----------------------------------------
	// ANIMATE
	// ----------------------------------------
	function animate() {
		requestAnimationFrame(animate);

		uniforms.uTime.value += 0.01;

		mesh.rotation.y = (uniforms.uMouse.value.x - 0.5) * 0.35;
		mesh.rotation.x = (uniforms.uMouse.value.y - 0.5) * -0.25;

		renderer.render(scene, camera);
	}

	return { init };

})();