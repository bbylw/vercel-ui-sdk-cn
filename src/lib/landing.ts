// Landing-page behaviour: opt into scroll reveals, then drive them and the
// nav's current-section marker. Content stays visible without JS or when the
// reader prefers reduced motion.

let cleanup: (() => void) | null = null;

export function initLanding() {
	cleanup?.();

	const root = document.documentElement;
	const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	root.classList.add("js");

	const revealables = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
	const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
	const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-nav]"));

	if (reduce || !("IntersectionObserver" in window)) {
		revealables.forEach((el) => el.classList.add("in-view"));
	} else {
		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						entry.target.classList.add("in-view");
						io.unobserve(entry.target);
					}
				}
			},
			{ rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
		);
		revealables.forEach((el) => io.observe(el));
		// Safety: never leave a block hidden if it was missed (e.g. a static
		// capture of the whole page without scrolling).
		const safety = window.setTimeout(() => revealables.forEach((el) => el.classList.add("in-view")), 3000);
		cleanup = () => {
			io.disconnect();
			window.clearTimeout(safety);
		};
	}

	// Current-section marker for the sticky nav.
	let frame = 0;
	const headerOffset = 96;
	function spy() {
		frame = 0;
		let current: string | null = null;
		for (const section of sections) {
			if (section.getBoundingClientRect().top <= headerOffset) current = section.id;
		}
		for (const link of navLinks) {
			const active = link.getAttribute("href") === `#${current}`;
			link.setAttribute("aria-current", active ? "true" : "false");
		}
	}
	function onScroll() {
		if (!frame) frame = requestAnimationFrame(spy);
	}
	spy();
	window.addEventListener("scroll", onScroll, { passive: true });

	// Mobile drop-down navigation under the sticky bar.
	const menuToggle = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
	const menuPanel = document.querySelector<HTMLElement>("[data-menu-panel]");
	const wide = window.matchMedia("(min-width: 768px)");
	function setMenu(open: boolean) {
		if (!menuToggle || !menuPanel) return;
		menuPanel.hidden = !open;
		menuToggle.setAttribute("aria-expanded", String(open));
		menuToggle.setAttribute("aria-label", open ? "关闭导航菜单" : "打开导航菜单");
	}
	function onMenuToggle() {
		setMenu(menuToggle?.getAttribute("aria-expanded") !== "true");
	}
	function onMenuNavigate(event: MouseEvent) {
		if ((event.target as HTMLElement).closest("a")) setMenu(false);
	}
	function onMenuKey(event: KeyboardEvent) {
		if (event.key === "Escape") setMenu(false);
	}
	function onWideChange(event: MediaQueryListEvent) {
		if (event.matches) setMenu(false);
	}
	menuToggle?.addEventListener("click", onMenuToggle);
	menuPanel?.addEventListener("click", onMenuNavigate);
	document.addEventListener("keydown", onMenuKey);
	wide.addEventListener("change", onWideChange);

	const prev = cleanup;
	cleanup = () => {
		prev?.();
		window.removeEventListener("scroll", onScroll);
		if (frame) cancelAnimationFrame(frame);
		menuToggle?.removeEventListener("click", onMenuToggle);
		menuPanel?.removeEventListener("click", onMenuNavigate);
		document.removeEventListener("keydown", onMenuKey);
		wide.removeEventListener("change", onWideChange);
		root.classList.remove("js");
	};
}