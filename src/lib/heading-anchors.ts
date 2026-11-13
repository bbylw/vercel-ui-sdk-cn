let liveRegion: HTMLDivElement | null = null;

function announce(message: string) {
  if (!liveRegion || !liveRegion.isConnected) {
    liveRegion = document.createElement("div");
    liveRegion.setAttribute("aria-live", "polite");
    Object.assign(liveRegion.style, {
      position: "absolute",
      width: "1px",
      height: "1px",
      padding: "0",
      margin: "-1px",
      overflow: "hidden",
      clipPath: "inset(50%)",
      whiteSpace: "nowrap",
      border: "0",
    });
    document.body.appendChild(liveRegion);
  }
  liveRegion.textContent = "";
  liveRegion.textContent = message;
}

const HEADINGS = ":is(.docs-content, [data-nb-heading-anchors]) :is(h2, h3, h4)[id]";

function applyHeadingAnchors() {
  document.querySelectorAll<HTMLElement>(HEADINGS).forEach((heading) => {
    if (heading.hasAttribute("data-heading-anchor-ready")) return;
    heading.setAttribute("data-heading-anchor-ready", "true");
    const link = document.createElement("a");
    link.href = `#${heading.id}`;
    link.className = "heading-anchor";
    link.setAttribute("aria-label", `复制「${heading.textContent?.trim() ?? "此章节"}」的链接`);
    link.textContent = "#";
    link.addEventListener("click", () => {
      const url = new URL(link.getAttribute("href") ?? `#${heading.id}`, location.href).href;
      navigator.clipboard?.writeText(url).then(
        () => announce("链接已复制到剪贴板"),
        () => {},
      );
    });
    heading.appendChild(link);
  });
}

/** Hoverable `#` self-links on h2–h4; click copies the deep link. Call once. */
export function headingAnchors() {
  applyHeadingAnchors();
  document.addEventListener("astro:page-load", applyHeadingAnchors);
}