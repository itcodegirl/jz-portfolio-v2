window.App.WebGL = window.App.WebGL || {};

window.App.WebGL.Background = {
	init() {
		if (window.App.device.isMobile && window.App.device.isWeakGPU()) return;

		const canvas = document.getElementById("bg-webgl");
		const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(1.25);

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 200);
		camera.position.z = 30;

		const count = 200;
		const geo = new THREE.BufferGeometry();
		const positions = new Float32Array(count * 3);

		for (let i = 0; i < count; i++) {
			positions[i * 3] = (Math.random() - 0.5) * 70;
			positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
			positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
		}

		geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

		const mat = new THREE.PointsMaterial({
			color: 0xffffff,
			size: 0.15,
			opacity: 0.25,
			transparent: true
		});

		const particles = new THREE.Points(geo, mat);
		scene.add(particles);

		function animate() {
			particles.rotation.y += 0.0003;
			particles.rotation.x += 0.00015;
			renderer.render(scene, camera);
			requestAnimationFrame(animate);
		}
		animate();
	}
};