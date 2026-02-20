window.App.WorkCards = {
	init() {
		gsap.utils.toArray(".glass-card").forEach(card => {
			card.addEventListener("mousemove", (e) => {
				const r = card.getBoundingClientRect();
				const x = e.clientX - (r.left + r.width / 2);
				const y = e.clientY - (r.top + r.height / 2);

				gsap.to(card, {
					rotateX: y * 0.05,
					rotateY: x * 0.05,
					duration: 0.3
				});
			});

			card.addEventListener("mouseleave", () => {
				gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5 });
			});
		});
	}
};