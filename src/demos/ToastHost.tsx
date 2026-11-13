import { useEffect } from "react";
import {
	Toast,
	ToastAction,
	ToastClose,
	ToastDescription,
	ToastRegion,
	ToastTitle,
	toast,
} from "@ui-sdk/react/toast";
import { cx } from "./ui";

const TONE: Record<string, string> = {
	success: "bg-success-muted text-success-foreground",
	error: "bg-danger-muted text-danger-foreground",
	warning: "bg-warning-muted text-warning-foreground",
	info: "bg-info-muted text-info-foreground",
	loading: "bg-accent text-muted-foreground",
	default: "bg-accent text-muted-foreground",
};

function ToneIcon({ type }: { type?: string }) {
	const common = "h-3.5 w-3.5";
	switch (type) {
		case "success":
			return (
				<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={common}>
					<path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			);
		case "error":
			return (
				<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={common}>
					<path d="m4.5 4.5 7 7m0-7-7 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
				</svg>
			);
		case "warning":
			return (
				<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={common}>
					<path d="M8 4v4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
					<circle cx="8" cy="11.5" r="0.9" fill="currentColor" />
				</svg>
			);
		case "loading":
			return (
				<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={cx(common, "animate-spin motion-reduce:animate-none")}>
					<path d="M8 2.5a5.5 5.5 0 1 0 5.5 5.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
				</svg>
			);
		default:
			return (
				<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={common}>
					<path d="M8 7.5v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
					<circle cx="8" cy="4.75" r="0.9" fill="currentColor" />
				</svg>
			);
	}
}

// One region for the whole site: every demo calls the shared `toast()`, so a
// single host shows them without duplicating the queue across islands.
export function ToastHost() {
	useEffect(() => () => toast.dismiss(), []);
	return (
		<ToastRegion side="bottom" align="end" aria-label="通知">
			{(t) => (
				<Toast className="flex items-start gap-3 rounded-xl border border-border bg-card p-3.5 shadow-lg">
					<span className={cx("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full", TONE[t.type ?? "default"] ?? TONE.default)}>
						<ToneIcon type={t.type} />
					</span>
					<div className="flex min-w-0 flex-1 flex-col gap-0.5">
						<ToastTitle className="text-sm font-medium text-foreground" />
						<ToastDescription className="text-xs leading-relaxed text-muted-foreground" />
						<ToastAction className="mt-1.5 self-start rounded-md border border-border-strong bg-card px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" />
					</div>
					<ToastClose
						aria-label="关闭通知"
						className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
					>
						<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-3.5 w-3.5">
							<path d="m4.5 4.5 7 7m0-7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
						</svg>
					</ToastClose>
				</Toast>
			)}
		</ToastRegion>
	);
}