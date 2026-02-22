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
	const container = document.getElementById('three-container');
	if (!container || typeof THREE === 'undefined') return;

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
	const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

	renderer.setSize(container.offsetWidth, container.offsetHeight);
	renderer.setClearColor(0x000000, 0);
	container.appendChild(renderer.domElement);

	const textureLoader = new THREE.TextureLoader();
	const imageTexture = textureLoader.load('assets/images/Jenna_robot_1.jpg');

	const imageWidth = 100;
	const imageHeight = 120;
	const particleCount = imageWidth * imageHeight;

	const geometry = new THREE.BufferGeometry();
	const positions = new Float32Array(particleCount * 3);
	const originalPositions = new Float32Array(particleCount * 3);
	const targetPositions = new Float32Array(particleCount * 3);
	const uvs = new Float32Array(particleCount * 2);
	const sizes = new Float32Array(particleCount);

	let index = 0;
	for (let i = 0; i < imageWidth; i++) {
		for (let j = 0; j < imageHeight; j++) {
			const x = (i / imageWidth) * 14 - 7;
			const y = (j / imageHeight) * 16 - 8;

			positions[index * 3] = x;
			positions[index * 3 + 1] = y;
			positions[index * 3 + 2] = 0;

			originalPositions[index * 3] = x;
			originalPositions[index * 3 + 1] = y;
			originalPositions[index * 3 + 2] = 0;

			targetPositions[index * 3] = x;
			targetPositions[index * 3 + 1] = y;
			targetPositions[index * 3 + 2] = 0;

			uvs[index * 2] = i / imageWidth;
			uvs[index * 2 + 1] = j / imageHeight;

			sizes[index] = Math.random() * 0.4 + 0.2;
			index++;
		}
	}

	geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
	geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
	geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

	const material = new THREE.ShaderMaterial({
		uniforms: { uTexture: { value: imageTexture } },
		vertexShader: `
			uniform sampler2D uTexture;
			attribute float size;
			varying vec4 vColor;
			void main() {
				vColor = texture2D(uTexture, uv);
				vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
				gl_Position = projectionMatrix * mvPosition;
				gl_PointSize = size * (400.0 / -mvPosition.z);
			}
		`,
		fragmentShader: `
			varying vec4 vColor;
			void main() {
				vec2 center = gl_PointCoord - vec2(0.5);
				if (length(center) > 0.5) discard;
				float alpha = 1.0 - smoothstep(0.2, 0.5, length(center));
				vec3 brightColor = pow(vColor.rgb * 1.8, vec3(0.9));
				gl_FragColor = vec4(brightColor, alpha * 0.95);
			}
		`,
		transparent: true
	});

	const particleSystem = new THREE.Points(geometry, material);
	scene.add(particleSystem);
	camera.position.z = 20;

	let isDragging = false;
	let mouseX = 0, mouseY = 0, animationProgress = 0;

	container.addEventListener('mousedown', (e) => {
		isDragging = true;
		container.style.cursor = 'grabbing';
		updateMouse(e);
	});

	container.addEventListener('mousemove', (e) => {
		updateMouse(e);
		if (!isDragging) return;
		animationProgress = Math.min(animationProgress + 0.015, 1.0);

		for (let i = 0; i < particleCount; i++) {
			const screenX = (originalPositions[i * 3] + 7) / 14;
			const screenY = (originalPositions[i * 3 + 1] + 8) / 16;
			const dist = Math.sqrt((screenX - mouseX) ** 2 + (screenY - mouseY) ** 2);
			const maxDist = 0.4;
			if (dist < maxDist) {
				const force = (maxDist - dist) / maxDist;
				const angle = Math.atan2(screenY - mouseY, screenX - mouseX);
				targetPositions[i * 3] = originalPositions[i * 3] + Math.cos(angle) * force * 12 * animationProgress;
				targetPositions[i * 3 + 1] = originalPositions[i * 3 + 1] + Math.sin(angle) * force * 12 * animationProgress;
				targetPositions[i * 3 + 2] = originalPositions[i * 3 + 2] + force * 6 * animationProgress;
			}
		}
	});

	container.addEventListener('mouseup', () => {
		isDragging = false;
		container.style.cursor = 'grab';
	});

	container.style.cursor = 'grab';

	function updateMouse(e) {
		const rect = container.getBoundingClientRect();
		mouseX = (e.clientX - rect.left) / rect.width;
		mouseY = 1.0 - (e.clientY - rect.top) / rect.height;
	}

	function animate() {
		requestAnimationFrame(animate);
		const posAttr = geometry.attributes.position;

		for (let i = 0; i < particleCount; i++) {
			if (!isDragging) {
				targetPositions[i * 3] = originalPositions[i * 3];
				targetPositions[i * 3 + 1] = originalPositions[i * 3 + 1];
				targetPositions[i * 3 + 2] = originalPositions[i * 3 + 2];
				animationProgress = Math.max(animationProgress - 0.02, 0);
			}
			positions[i * 3] += (targetPositions[i * 3] - positions[i * 3]) * 0.1;
			positions[i * 3 + 1] += (targetPositions[i * 3 + 1] - positions[i * 3 + 1]) * 0.1;
			positions[i * 3 + 2] += (targetPositions[i * 3 + 2] - positions[i * 3 + 2]) * 0.1;
		}

		posAttr.needsUpdate = true;
		renderer.render(scene, camera);
	}

	animate();

	window.addEventListener('resize', () => {
		if (!container.offsetWidth || !container.offsetHeight) return;
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
