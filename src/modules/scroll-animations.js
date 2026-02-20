window.App.ScrollFX = {
	init() {
		gsap.utils.toArray("section").forEach(sec => {
			gsap.from(sec, {
				opacity: 0,
				y: 70,
				filter: "blur(10px)",
				duration: 1.4,
				scrollTrigger: { trigger: sec, start: "top 85%" }
			});
		});
	}
};