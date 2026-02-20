window.App = window.App || {};

window.App.Nav = {
	init() {
		const nav = document.querySelector(".nav");

		ScrollTrigger.create({
			start: "top -10",
			end: 999999,
			onUpdate(self) {
				if (self.direction === -1) nav.classList.add("nav-show");
				else nav.classList.remove("nav-show");
			}
		});
	}
};