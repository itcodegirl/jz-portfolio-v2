/* =====================================================
	 DEVICE + GPU + CAPABILITY DETECTION
	 FS1 — Portrait Engine Logic
===================================================== */
export const Device = (() => {

	/* ==============================================
		 FLAGS (public)
	================================================ */
	let isMobile = false;
	let isTouch = false;
	let isLowGPU = false;
	let prefersReducedMotion = false;

	let webglSupported = false;
	let webgl2Supported = false;

	// Final decision for portrait system:
	let canUseWebGLPortrait = false;


	/* ==============================================
		 Check mobile / touch
	================================================ */
	function detectMobile() {
		isMobile =
			/Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent)
			|| window.innerWidth < 820;

		isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
	}


	/* ==============================================
		 Check performance (very lightweight heuristic)
	================================================ */
	function detectLowGPU() {
		// Avoid heavy GPU feature queries (bad on Safari)
		const start = performance.now();
		for (let i = 0; i < 50_000; i++) { } // cheap CPU loop
		const end = performance.now();

		// Slow devices take far longer
		isLowGPU = (end - start) > 12; // threshold tuned for mobile
	}


	/* ==============================================
		 Check prefers-reduced-motion
	================================================ */
	function detectReducedMotion() {
		prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	}


	/* ==============================================
		 Check WebGL1 + WebGL2 support
	================================================ */
	function detectWebGL() {
		try {
			const canvas = document.createElement("canvas");

			const gl = canvas.getContext("webgl")
				|| canvas.getContext("experimental-webgl");
			webglSupported = !!gl;

			const gl2 = canvas.getContext("webgl2");
			webgl2Supported = !!gl2;

		} catch (e) {
			webglSupported = false;
			webgl2Supported = false;
		}
	}


	/* ==============================================
		 FINAL DECISION LOGIC
		 When true → PortraitWebGL.init() will run
	================================================ */
	function computePortraitEligibility() {

		// ❌ Disallow WebGL on low-power mobile devices
		if (isMobile && isLowGPU) return false;

		// ❌ Respect accessibility settings
		if (prefersReducedMotion) return false;

		// ❌ WebGL not supported at all
		if (!webglSupported) return false;

		// ❌ If device looks old
		if (!webgl2Supported && isMobile) return false;

		// ✔ Desktop ALWAYS allowed if WebGL2 exists
		if (!isMobile && webgl2Supported) return true;

		// ✔ High-end mobile allowed
		if (isMobile && !isLowGPU && webgl2Supported) return true;

		// Fallback
		return false;
	}


	/* ==============================================
		 Apply CSS classes to <body>
	================================================ */
	function applyBodyClasses() {
		document.body.classList.toggle("is-mobile", isMobile);
		document.body.classList.toggle("is-touch", isTouch);
		document.body.classList.toggle("low-gpu", isLowGPU);
		document.body.classList.toggle("reduced-motion", prefersReducedMotion);
		document.body.classList.toggle("webgl-enabled", canUseWebGLPortrait);
		document.body.classList.toggle("webgl-disabled", !canUseWebGLPortrait);
	}


	/* ==============================================
		 PUBLIC INIT
	================================================ */
	function init() {
		console.log("%c[Device] Running capability detection…",
			"color:#7dd");

		detectMobile();
		detectLowGPU();
		detectReducedMotion();
		detectWebGL();

		canUseWebGLPortrait = computePortraitEligibility();

		applyBodyClasses();

		console.table({
			isMobile,
			isTouch,
			isLowGPU,
			prefersReducedMotion,
			webglSupported,
			webgl2Supported,
			canUseWebGLPortrait
		});
	}


	/* ==============================================
		 PUBLIC API
	================================================ */
	return {
		init,
		get isMobile() { return isMobile; },
		get isTouch() { return isTouch; },
		get isLowGPU() { return isLowGPU; },
		get prefersReducedMotion() { return prefersReducedMotion; },
		get webglSupported() { return webglSupported; },
		get webgl2Supported() { return webgl2Supported; },
		get canUseWebGLPortrait() { return canUseWebGLPortrait; }
	};

})();