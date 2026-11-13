// Landing-page behaviour: opt into scroll reveals, drive them and the nav's
// current-section marker, manage the mobile menu, and wire static code copy.
// Content stays visible without JS or when the reader prefers reduced motion.

let cleanup: (() => void) | null = null;

export function initLanding() {
	cleanup?.();

	const root = document.documentElement;
	const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	root.classList.add("js");

	const revealables = Array.from(document.querySelectorAll<HTMLElement>(".reveal, .tagline-line"));
	const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
	const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-nav]"));
	const header = document.querySelector<HTMLElement>(".landing-nav");

	let io: IntersectionObserver | null = null;
	let safety = 0;

	if (reduce || !("IntersectionObserver" in window)) {
		revealables.forEach((el) => el.classList.add("in-view"));
	} else {
		io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						entry.target.classList.add("in-view");
						io?.unobserve(entry.target);
					}
				}
			},
			{ rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
		);
		revealables.forEach((el) => io?.observe(el));
		// Safety: never leave a block hidden if an intersection callback was skipped.
		safety = window.setTimeout(() => revealables.forEach((el) => el.classList.add("in-view")), 3000);
	}

	// Current-section marker + scrolled header elevation.
	let frame = 0;
	const headerOffset = 96;
	function spy() {
		frame = 0;
		if (header) {
			header.dataset.scrolled = window.scrollY > 12 ? "true" : "false";
		}
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
	window.addEventListener("scrollend", spy, { passive: true });

	// Mobile drop-down navigation under the sticky bar.
	const menuToggle = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
	const menuPanel = document.querySelector<HTMLElement>("[data-menu-panel]");
	const menuOpenIcon = document.querySelector<HTMLElement>("[data-menu-icon-open]");
	const menuCloseIcon = document.querySelector<HTMLElement>("[data-menu-icon-close]");
	const wide = window.matchMedia("(min-width: 768px)");

	function setMenu(open: boolean, returnFocus = false) {
		if (!menuToggle || !menuPanel) return;
		menuPanel.hidden = !open;
		menuToggle.setAttribute("aria-expanded", String(open));
		menuToggle.setAttribute("aria-label", open ? "关闭导航菜单" : "打开导航菜单");
		if (menuOpenIcon) menuOpenIcon.hidden = open;
		if (menuCloseIcon) menuCloseIcon.hidden = !open;
		if (!open && returnFocus) menuToggle.focus();
	}
	function onMenuToggle() {
		setMenu(menuToggle?.getAttribute("aria-expanded") !== "true");
	}
	function onMenuNavigate(event: MouseEvent) {
		if ((event.target as HTMLElement).closest("a")) setMenu(false);
	}
	function onMenuKey(event: KeyboardEvent) {
		if (event.key === "Escape" && menuToggle?.getAttribute("aria-expanded") === "true") {
			setMenu(false, true);
		}
	}
	function onDocumentClick(event: MouseEvent) {
		if (!menuPanel || menuPanel.hidden) return;
		const target = event.target as Node;
		if (!menuPanel.contains(target) && !menuToggle?.contains(target)) {
			setMenu(false);
		}
	}
	function onWideChange(event: MediaQueryListEvent) {
		if (event.matches) setMenu(false);
	}
	menuToggle?.addEventListener("click", onMenuToggle);
	menuPanel?.addEventListener("click", onMenuNavigate);
	document.addEventListener("keydown", onMenuKey);
	document.addEventListener("click", onDocumentClick);
	wide.addEventListener("change", onWideChange);

	// Copy buttons on static landing code cards (e.g., agent.ts snippet).
	const copyCleanups: Array<() => void> = [];
	document.querySelectorAll<HTMLButtonElement>("[data-landing-copy]").forEach((btn) => {
		let timer = 0;
		const label = btn.querySelector<HTMLElement>("[data-copy-label]");
		const onClick = async () => {
			const code = btn.dataset.landingCopy ?? "";
			try {
				await navigator.clipboard?.writeText(code);
			} catch {
				/* Clipboard may be unavailable; button state still confirms interaction. */
			}
			btn.dataset.copied = "true";
			if (label) label.textContent = "已复制";
			window.clearTimeout(timer);
			timer = window.setTimeout(() => {
				delete btn.dataset.copied;
				if (label) label.textContent = "复制";
			}, 1600);
		};
		btn.addEventListener("click", onClick);
		copyCleanups.push(() => {
			window.clearTimeout(timer);
			btn.removeEventListener("click", onClick);
		});
	});

	// Interactive tab switchers for multi-file landing code cards.
	const tabCleanups: Array<() => void> = [];
	document.querySelectorAll<HTMLElement>("[data-agent-tabs]").forEach((rootEl) => {
		const tabs = Array.from(rootEl.querySelectorAll<HTMLButtonElement>("[data-agent-tab]"));
		const panels = Array.from(rootEl.querySelectorAll<HTMLElement>("[data-agent-panel]"));
		const copyBtn = rootEl.querySelector<HTMLButtonElement>("[data-landing-copy]");

		const activate = (nextTab: HTMLButtonElement, moveFocus = false) => {
			const id = nextTab.dataset.agentTab;
			if (!id) return;
			for (const tab of tabs) {
				const selected = tab === nextTab;
				tab.setAttribute("aria-selected", String(selected));
				tab.tabIndex = selected ? 0 : -1;
			}
			for (const panel of panels) {
				panel.hidden = panel.dataset.agentPanel !== id;
			}
			if (copyBtn && nextTab.dataset.agentCode) {
				copyBtn.dataset.landingCopy = nextTab.dataset.agentCode;
			}
			if (moveFocus) nextTab.focus();
		};

		const onClick = (event: MouseEvent) => {
			const tab = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-agent-tab]");
			if (tab) activate(tab);
		};
		const onKeyDown = (event: KeyboardEvent) => {
			const current = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-agent-tab]");
			if (!current) return;
			const index = tabs.indexOf(current);
			if (index < 0) return;
			let nextIndex = -1;
			if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
			else if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
			else if (event.key === "Home") nextIndex = 0;
			else if (event.key === "End") nextIndex = tabs.length - 1;
			if (nextIndex >= 0) {
				event.preventDefault();
				activate(tabs[nextIndex], true);
			}
		};

		rootEl.addEventListener("click", onClick);
		rootEl.addEventListener("keydown", onKeyDown);
		tabCleanups.push(() => {
			rootEl.removeEventListener("click", onClick);
			rootEl.removeEventListener("keydown", onKeyDown);
		});
	});

	cleanup = () => {
		io?.disconnect();
		window.clearTimeout(safety);
		window.removeEventListener("scroll", onScroll);
		window.removeEventListener("scrollend", spy);
		if (frame) cancelAnimationFrame(frame);
		menuToggle?.removeEventListener("click", onMenuToggle);
		menuPanel?.removeEventListener("click", onMenuNavigate);
		document.removeEventListener("keydown", onMenuKey);
		document.removeEventListener("click", onDocumentClick);
		wide.removeEventListener("change", onWideChange);
		copyCleanups.forEach((fn) => fn());
		tabCleanups.forEach((fn) => fn());
		root.classList.remove("js");
	};
}
