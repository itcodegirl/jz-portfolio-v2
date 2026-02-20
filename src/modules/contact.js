window.App.ContactFX = {
	init() {
		gsap.utils.toArray(".contact-link").forEach((link, i) => {
			gsap.from(link, {
				opacity: 0,
				y: 30,
				delay: i * 0.1,
				duration: 0.8,
				scrollTrigger: { trigger: link, start: "top 90%" }
			});
		});
	}
};