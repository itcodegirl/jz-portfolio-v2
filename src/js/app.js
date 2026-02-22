gsap.registerPlugin(ScrollTrigger);

/* =====================================================
	 INTRO VIDEO SYSTEM WITH FALLBACK
===================================================== */

const introVideo = document.getElementById("introVideo");
let introFinished = false;
let introStartTime = Date.now();
const MINIMUM_INTRO_DURATION = 3000;

function finishIntro() {
	if (introFinished) return;

	const elapsed = Date.now() - introStartTime;
	const remainingTime = Math.max(0, MINIMUM_INTRO_DURATION - elapsed);

	if (remainingTime > 0) {
		setTimeout(() => finishIntro(), remainingTime);
		return;
	}

	introFinished = true;

	const intro = document.querySelector(".intro-video");
	if (intro) {
		intro.style.opacity = '0';
		setTimeout(() => intro.remove(), 800);
	}

	document.body.classList.remove("no-scroll");

	if (typeof ScrollTrigger !== 'undefined') {
		ScrollTrigger.refresh(true);
	}

	initWebGL();
	initHeroCinematic();
	initSectionReveals();
	initSkillsAnimation();
	initNavCinematic();
	initProjectModals();
	initContactAnimations();
}

if (introVideo) {
	introVideo.addEventListener("ended", finishIntro);
	introVideo.addEventListener("error", () => finishIntro());
	introVideo.addEventListener("abort", () => finishIntro());

	setTimeout(() => {
		if (!introFinished) finishIntro();
	}, 8000);
} else {
	finishIntro();
}

document.addEventListener('DOMContentLoaded', function () {
	setTimeout(() => {
		if (!introFinished) finishIntro();
	}, 4000);
});

/* =====================================================
	 ENHANCED PROJECT MODAL SYSTEM
===================================================== */

function initProjectModals() {
	const modalOverlay = document.getElementById('modalOverlay');
	const viewButtons = document.querySelectorAll('.view-btn');
	const closeButtons = document.querySelectorAll('.modal-close');

	function openModal(modalId) {
		const modal = document.getElementById(`modal${modalId}`);
		if (modal && modalOverlay) {
			modalOverlay.classList.add('active');
			modal.classList.add('active');
			document.body.style.overflow = 'hidden';

			gsap.from(modal.querySelector('.glass-modal'), {
				scale: 0.8,
				opacity: 0,
				y: 50,
				duration: 0.4,
				ease: "back.out(1.7)"
			});
		}
	}

	function closeModal() {
		const activeModal = document.querySelector('.modal.active');
		if (activeModal && modalOverlay) {
			gsap.to(activeModal.querySelector('.glass-modal'), {
				scale: 0.9,
				opacity: 0,
				y: 30,
				duration: 0.3,
				ease: "power2.in",
				onComplete: () => {
					modalOverlay.classList.remove('active');
					activeModal.classList.remove('active');
					document.body.style.overflow = '';
				}
			});
		}
	}

	viewButtons.forEach(button => {
		button.addEventListener('click', (e) => {
			e.preventDefault();
			const projectId = button.getAttribute('data-project');
			if (projectId) openModal(projectId);
		});
	});

	closeButtons.forEach(button => {
		button.addEventListener('click', closeModal);
	});

	modalOverlay?.addEventListener('click', (e) => {
		if (e.target === modalOverlay) closeModal();
	});

	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') closeModal();
	});
}

/* =====================================================
	 CINEMATIC HERO MOTION
===================================================== */

function initHeroCinematic() {

	gsap.from(".hero-title", {
		opacity: 0,
		y: 60,
		duration: 1.,
		ease: "power3.out",
		delay: 0.3
	});

	gsap.from(".hero-sub", {
		opacity: 0,
		y: 40,
		duration: 1.4,
		ease: "power3.out",
		delay: 0.6
	});

	// 👇 Add this block
	gsap.from(".hero-visual", {
		opacity: 0,
		scale: 0.95,
		duration: 1.4,
		ease: "power3.out",
		delay: 0.5
	});
}

/* =====================================================
	 SECTION REVEALS
===================================================== */

function initSectionReveals() {
	gsap.utils.toArray("section").forEach((sec) => {
		gsap.from(sec, {
			opacity: 0,
			y: 70,
			filter: "blur(10px)",
			duration: 1.4,
			ease: "power3.out",
			scrollTrigger: {
				trigger: sec,
				start: "top 85%",
			}
		});
	});
}

/* =====================================================
	 ENHANCED SKILLS ANIMATION
===================================================== */

function initSkillsAnimation() {
	const timeline = document.querySelector(".skills-timeline");
	if (!timeline) return;

	let animatedLine = timeline.querySelector('.timeline-progress');
	if (!animatedLine) {
		animatedLine = document.createElement('div');
		animatedLine.className = 'timeline-progress';
		timeline.appendChild(animatedLine);
	}

	ScrollTrigger.create({
		trigger: ".skills-timeline",
		start: "top 80%",
		end: "bottom 20%",
		scrub: 1,
		onUpdate: (self) => {
			animatedLine.style.height = `${self.progress * 100}%`;
		}
	});

	gsap.utils.toArray(".skill-item").forEach((item, index) => {
		gsap.fromTo(item,
			{ opacity: 0, y: 40 },
			{
				opacity: 1,
				y: 0,
				duration: 1.1,
				ease: "power3.out",
				delay: index * 0.2,
				scrollTrigger: {
					trigger: item,
					start: "top 85%"
				}
			}
		);
	});
}

/* =====================================================
	 NAV CINEMATIC BEHAVIOR
===================================================== */

function initNavCinematic() {
	const nav = document.querySelector(".nav");
	if (!nav) return;

	ScrollTrigger.create({
		start: "top -10",
		end: 999999,
		onUpdate: (self) => {
			if (self.direction === -1) nav.classList.add("nav-show");
			else nav.classList.remove("nav-show");
		}
	});
}

/* =====================================================
	 WORK CARD ANIMATIONS
===================================================== */

gsap.utils.toArray(".glass-card").forEach((card, i) => {
	gsap.from(card, {
		opacity: 0,
		y: 50,
		scale: 0.9,
		duration: 1,
		delay: i * 0.1,
		ease: "back.out(1.7)",
		scrollTrigger: {
			trigger: card,
			start: "top 85%"
		}
	});

	card.addEventListener('mousemove', (e) => {
		const rect = card.getBoundingClientRect();
		const x = e.clientX - rect.left - rect.width / 2;
		const y = e.clientY - rect.top - rect.height / 2;

		gsap.to(card, {
			duration: 0.3,
			rotateX: y * 0.05,
			rotateY: x * 0.05,
			transformPerspective: 1000
		});
	});

	card.addEventListener('mouseleave', () => {
		gsap.to(card, { duration: 0.5, rotateX: 0, rotateY: 0 });
	});
});

/* =====================================================
	 SCROLL PROGRESS BAR
===================================================== */

const progressBar = document.querySelector(".scroll-progress");

window.addEventListener("scroll", () => {
	const scrollTop = window.scrollY;
	const docHeight = document.body.scrollHeight - innerHeight;
	const progress = Math.min((scrollTop / docHeight) * 100, 100);
	if (progressBar) progressBar.style.height = progress + "%";
});

/* =====================================================
	 MAGNETIC CURSOR
===================================================== */

const cursor = document.querySelector(".custom-cursor");

if (cursor) {
	let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

	function updateCursor() {
		cursorX += (mouseX - cursorX) * 0.1;
		cursorY += (mouseY - cursorY) * 0.1;
		cursor.style.left = cursorX + "px";
		cursor.style.top = cursorY + "px";
		requestAnimationFrame(updateCursor);
	}

	window.addEventListener("mousemove", (e) => {
		mouseX = e.clientX;
		mouseY = e.clientY;
	});

	updateCursor();

	document.querySelectorAll("a, button, .glass-card").forEach(el => {
		el.addEventListener("mousemove", (e) => {
			const rect = el.getBoundingClientRect();
			const x = e.clientX - rect.left - rect.width / 2;
			const y = e.clientY - rect.top - rect.height / 2;
			gsap.to(el, { duration: 0.3, x: x * 0.1, y: y * 0.1, scale: 1.03, ease: "power2.out" });
		});

		el.addEventListener("mouseleave", () => {
			gsap.to(el, { duration: 0.5, x: 0, y: 0, scale: 1, ease: "power2.out" });
		});
	});
}

/* =====================================================
	 CONTACT ANIMATIONS
===================================================== */

function initContactAnimations() {
	gsap.utils.toArray(".contact-link").forEach((link, i) => {
		gsap.from(link, {
			opacity: 0,
			y: 30,
			duration: 0.8,
			delay: i * 0.1,
			ease: "back.out(1.7)",
			scrollTrigger: {
				trigger: link,
				start: "top 90%"
			}
		});
	});
}

/* =====================================================
	 WEBGL PORTRAIT (drag-controlled particles)
===================================================== */

function initWebGL() {

	const container = document.getElementById("three-container");
	if (!container) return;

	const scene = new THREE.Scene();

	const camera = new THREE.PerspectiveCamera(
		45,
		container.offsetWidth / container.offsetHeight,
		0.1,
		1000
	);

	camera.position.z = 30;

	const renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true
	});

	renderer.setSize(container.offsetWidth, container.offsetHeight);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	container.innerHTML = "";
	container.appendChild(renderer.domElement);

	const textureLoader = new THREE.TextureLoader();

	const imagePath = "assets/images/Jenna_robot_1.jpg";

	textureLoader.load(imagePath, (texture) => {

		const geometry = new THREE.PlaneGeometry(16, 22, 70, 90);

		const count = geometry.attributes.position.count;

		const randoms = new Float32Array(count * 3);
		const offsets = new Float32Array(count);

		for (let i = 0; i < count; i++) {
			randoms[i * 3] = (Math.random() - 0.5) * 1.2;
			randoms[i * 3 + 1] = (Math.random() - 0.5) * 1.2;
			randoms[i * 3 + 2] = Math.random() * 1.0;
			offsets[i] = Math.random();
		}

		geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 3));
		geometry.setAttribute("aOffset", new THREE.BufferAttribute(offsets, 1));

		const material = new THREE.ShaderMaterial({
			uniforms: {
				uTexture: { value: texture },
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

				void main() {
					vUv = uv;

					vec3 pos = position;

					float dist = distance(uv, uMouse);
					float influence = smoothstep(0.25, 0.0, dist) * uHover;

					vec3 explode = aRandom * influence * 0.8;
					float floatMotion = sin(uTime * 0.6 + aOffset * 4.0) * 0.03;

					pos += explode;
					pos.z += floatMotion * uHover;

					gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
				}
			`,
			fragmentShader: `
	uniform sampler2D uTexture;
			uniform vec2 uMouse;
			uniform float uHover;
			varying vec2 vUv;

			void main() {

				vec2 uv = vUv;

				// Distance to mouse for localized effect
				float dist = distance(uv, uMouse);
				float influence = smoothstep(0.35, 0.0, dist) * uHover;

				// Subtle chromatic separation
				vec2 chromaOffset = (uv - 0.5) * 0.003 * influence;

				vec4 r = texture2D(uTexture, uv + chromaOffset);
				vec4 g = texture2D(uTexture, uv);
				vec4 b = texture2D(uTexture, uv - chromaOffset);

				vec3 color = vec3(r.r, g.g, b.b);

				// Soft glass highlight sweep
				float light = smoothstep(0.2, 0.8, uv.y + sin(uv.x * 6.0) * 0.03);
				color += light * influence * 0.08;

		gl_FragColor = vec4(color, 1.0);
			}
`,
			transparent: true
		});

		const mesh = new THREE.Mesh(geometry, material);
		scene.add(mesh);

		let hover = 0;

		container.addEventListener("mousemove", (e) => {
			const rect = container.getBoundingClientRect();
			const x = (e.clientX - rect.left) / rect.width;
			const y = 1.0 - (e.clientY - rect.top) / rect.height;
			material.uniforms.uMouse.value.set(x, y);
			hover = 1;
		});

		container.addEventListener("mouseleave", () => {
			hover = 0;
		});

		function animate() {
			requestAnimationFrame(animate);
			material.uniforms.uTime.value += 0.02;
			material.uniforms.uHover.value += (hover - material.uniforms.uHover.value) * 0.06;
			renderer.render(scene, camera);
		}

		animate();
	});

	window.addEventListener("resize", () => {
		camera.aspect = container.offsetWidth / container.offsetHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(container.offsetWidth, container.offsetHeight);
	});
}
/* =====================================================
	 ERROR HANDLING
===================================================== */

window.addEventListener('error', (e) => {
	console.error('JavaScript error:', e.error);
});
