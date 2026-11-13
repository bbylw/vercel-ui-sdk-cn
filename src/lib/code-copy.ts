import { mount } from "@cloudflare/nimbus-docs/client";

const COPY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"/></svg>`;
const CHECK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34Z"/></svg>`;

const IDLE_LABEL = "复制代码";
const DONE_LABEL = "已复制";

function getCodeText(pre: HTMLElement): string {
  return pre.querySelector("code")?.textContent ?? pre.textContent ?? "";
}

function initCodeCopy(pre: HTMLElement): () => void {
  // CodeGroup brings its own copy button per panel.
  if (pre.closest("[data-cg-panels-raw], [data-cg-row]")) return () => {};
  const host = (pre.closest(".nb-code-figure") as HTMLElement | null) ?? pre;
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "nb-code-copy";
  btn.setAttribute("aria-label", IDLE_LABEL);
  btn.innerHTML = COPY_ICON;
  let resetTimer: number | undefined;

  async function handleClick() {
    const text = getCodeText(pre);
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    btn.innerHTML = CHECK_ICON;
    btn.dataset.state = "copied";
    btn.setAttribute("aria-label", DONE_LABEL);
    if (resetTimer) window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => {
      btn.innerHTML = COPY_ICON;
      delete btn.dataset.state;
      btn.setAttribute("aria-label", IDLE_LABEL);
    }, 1500);
  }

  btn.addEventListener("click", handleClick);
  host.style.position = "relative";
  host.prepend(btn);
  return () => {
    if (resetTimer) window.clearTimeout(resetTimer);
    btn.removeEventListener("click", handleClick);
    btn.remove();
  };
}

/** Wire copy buttons onto all Shiki code blocks. Call once from BaseLayout. */
export function codeCopy() {
  mount("pre.astro-code", initCodeCopy);
}