window.App = window.App || {};

window.App.Intro = (function () {
	const MIN_DURATION = 3000;
	let startTime = Date.now();
	let finished = false;

	function finish() {
		if (finished) return;
		finished = true;

		const intro = document.querySelector(".intro-video");
		intro.style.opacity = "0";
		setTimeout(() => intro.remove(), 800);

		document.body.classList.remove("no-scroll");

		if (window.gsap && window.ScrollTrigger) {
			ScrollTrigger.refresh(true);
		}

		window.App.init();
	}

	function init() {
		const video = document.getElementById("introVideo");

		if (video) {
			video.addEventListener("ended", () => finish());
			video.addEventListener("error", () => finish());
		}

		setTimeout(() => {
			if (!finished) finish();
		}, MIN_DURATION + 2000);
	}

	return { init, finish };
})();