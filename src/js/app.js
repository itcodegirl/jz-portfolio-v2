import { PortraitWebGL } from "../../webgl/portrait.js";
import { Device } from "./devices.js";

gsap.registerPlugin(ScrollTrigger);

console.log("app.js loaded");

let introFinished = false;

/* =====================================================
	 INTRO CONTROL
===================================================== */

function finishIntro() {
	if (introFinished) return;
	introFinished = true;

	console.log("Finishing intro…");

	const introWrapper = document.querySelector(".intro-video");

	if (introWrapper) {
		gsap.to(introWrapper, {
			opacity: 0,
			duration: 0.8,
			ease: "power2.out",
			onComplete: () => introWrapper.remove()
		});
	}

	document.body.classList.remove("no-scroll");

	initializeApp();
}

/* =====================================================
	 INITIALIZE MAIN APP
===================================================== */

function initializeApp() {
	safeInit("Device detection", () => Device.init());
	safeInit("WebGL portrait", () => PortraitWebGL.init(Device));
	safeInit("Hero cinematic", initHeroCinematic);
	safeInit("Section reveals", initSectionReveals);
	safeInit("Skills timeline", initSkillsAnimation);
	safeInit("Navigation behavior", initNavCinematic);
	safeInit("Modals", initProjectModals);
	safeInit("Contact animations", initContactAnimations);
}

function safeInit(name, fn) {
	try {
		fn && fn();
		console.log(`✔ ${name} initialized`);
	} catch (e) {
		console.warn(`⚠ ${name} failed:`, e);
	}
}

/* =====================================================
	 IMPROVED INTRO VIDEO HANDLING
===================================================== */

const video = document.getElementById("introVideo");

if (video) {

	// Try autoplay once ready
	video.addEventListener("canplaythrough", () => {
		video.play().catch(() => finishIntro());
	});

	// If video completes normally
	video.addEventListener("ended", finishIntro);

	// If video fails to load
	video.addEventListener("error", finishIntro);

	// Short fallback timeout (max 2.5s black screen)
	setTimeout(() => {
		if (!introFinished) finishIntro();
	}, 2500);
} else {
	// If no video exists, start immediately
	finishIntro();
}

/* =====================================================
	 HERO CINEMATIC
===================================================== */

function initHeroCinematic() {
	gsap.from(".hero-title", {
		opacity: 0,
		y: 60,
		duration: 1.4,
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
}

/* =====================================================
	 SECTION REVEALS
===================================================== */

function initSectionReveals() {
	gsap.utils.toArray("section").forEach((sec) => {
		gsap.from(sec, {
			opacity: 0,
			y: 70,
			duration: 1.2,
			ease: "power3.out",
			scrollTrigger: {
				trigger: sec,
				start: "top 85%"
			}
		});
	});
}

/* =====================================================
	 SKILLS TIMELINE
===================================================== */

function initSkillsAnimation() {
	const timeline = document.querySelector(".skills-timeline");
	if (!timeline) return;

	let animatedLine = timeline.querySelector(".timeline-progress");

	if (!animatedLine) {
		animatedLine = document.createElement("div");
		animatedLine.className = "timeline-progress";
		timeline.appendChild(animatedLine);
	}

	ScrollTrigger.create({
		trigger: timeline,
		start: "top 80%",
		end: "bottom 20%",
		scrub: 1,
		onUpdate: (self) => {
			animatedLine.style.height = `${self.progress * 100}%`;
		}
	});

	gsap.utils.toArray(".skill-item").forEach((item, i) => {
		gsap.from(item, {
			opacity: 0,
			y: 40,
			duration: 1,
			ease: "power3.out",
			delay: i * 0.15,
			scrollTrigger: {
				trigger: item,
				start: "top 85%"
			}
		});
	});
}

/* =====================================================
	 NAVIGATION BEHAVIOR
===================================================== */

function initNavCinematic() {
	const nav = document.querySelector(".nav");
	if (!nav) return;

	ScrollTrigger.create({
		start: "top -10",
		end: "max",
		onUpdate: (self) => {
			if (self.direction === -1) nav.classList.add("nav-show");
			else nav.classList.remove("nav-show");
		}
	});
}

/* =====================================================
	 MODALS
===================================================== */

function initProjectModals() {
	const overlay = document.getElementById("modalOverlay");
	if (!overlay) return;

	const viewButtons = document.querySelectorAll(".view-btn");
	const closeButtons = document.querySelectorAll(".modal-close");

	function openModal(id) {
		const modal = document.getElementById(`modal${id}`);
		if (!modal) return;

		overlay.classList.add("active");
		modal.classList.add("active");
		document.body.style.overflow = "hidden";

		gsap.from(modal.querySelector(".glass-modal"), {
			scale: 0.9,
			opacity: 0,
			y: 40,
			duration: 0.4,
			ease: "back.out(1.6)"
		});
	}

	function closeModal() {
		const active = document.querySelector(".modal.active");
		if (!active) return;

		gsap.to(active.querySelector(".glass-modal"), {
			scale: 0.95,
			opacity: 0,
			y: 30,
			duration: 0.25,
			ease: "power2.in",
			onComplete: () => {
				active.classList.remove("active");
				overlay.classList.remove("active");
				document.body.style.overflow = "";
			}
		});
	}

	viewButtons.forEach(btn =>
		btn.addEventListener("click", e => {
			e.preventDefault();
			openModal(btn.dataset.project);
		})
	);

	closeButtons.forEach(btn =>
		btn.addEventListener("click", closeModal)
	);

	overlay.addEventListener("click", e => {
		if (e.target === overlay) closeModal();
	});

	document.addEventListener("keydown", e => {
		if (e.key === "Escape") closeModal();
	});
}

/* =====================================================
	 CONTACT ANIMATIONS
===================================================== */

function initContactAnimations() {
	gsap.utils.toArray(".contact-link").forEach((link, i) => {
		gsap.from(link, {
			opacity: 0,
			y: 25,
			duration: 0.8,
			ease: "back.out(1.4)",
			delay: i * 0.1,
			scrollTrigger: {
				trigger: link,
				start: "top 90%"
			}
		});
	});
}

/* =====================================================
	 GLOBAL ERROR LOGGING
===================================================== */

window.addEventListener("error", (e) => {
	console.log("JS ERROR:", e.message);
});