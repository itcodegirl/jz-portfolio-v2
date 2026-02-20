window.App.Modals = {
	init() {
		const overlay = document.getElementById("modalOverlay");
		const buttons = document.querySelectorAll(".view-btn");
		const closes = document.querySelectorAll(".modal-close");

		function open(id) {
			const modal = document.getElementById(`modal${id}`);
			overlay.classList.add("active");
			modal.classList.add("active");
			document.body.style.overflow = "hidden";

			gsap.from(modal.querySelector(".glass-modal"), {
				scale: 0.8, opacity: 0, y: 50, duration: 0.4
			});
		}

		function close() {
			const modal = document.querySelector(".modal.active");
			if (!modal) return;

			gsap.to(modal.querySelector(".glass-modal"), {
				scale: 0.9, opacity: 0, y: 30, duration: 0.3,
				onComplete() {
					overlay.classList.remove("active");
					modal.classList.remove("active");
					document.body.style.overflow = "";
				}
			});
		}

		buttons.forEach(btn =>
			btn.addEventListener("click", () => open(btn.dataset.project))
		);

		closes.forEach(btn =>
			btn.addEventListener("click", close)
		);

		overlay.addEventListener("click", e => {
			if (e.target === overlay) close();
		});

		document.addEventListener("keydown", e => {
			if (e.key === "Escape") close();
		});
	}
};