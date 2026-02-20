window.App.Cursor = {
	init() {
		const cursor = document.querySelector(".custom-cursor");
		if (!cursor) return;

		let mx = 0, my = 0, cx = 0, cy = 0;

		function loop() {
			cx += (mx - cx) * 0.1;
			cy += (my - cy) * 0.1;

			cursor.style.transform = `translate(${cx}px, ${cy}px)`;
			requestAnimationFrame(loop);
		}
		loop();

		window.addEventListener("mousemove", e => {
			mx = e.clientX;
			my = e.clientY;
		});
	}
};