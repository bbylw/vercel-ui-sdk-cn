import { Button } from "@ui-sdk/react/button";
import type { ComponentProps, ReactNode } from "react";

export const cx = (...parts: Array<string | false | null | undefined>) =>
	parts.filter(Boolean).join(" ");

const btnBase =
	"inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-[color,background-color,border-color,transform,filter] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50";

export const btn = {
	primary: cx(btnBase, "h-10 px-5 bg-brand text-primary-foreground hover:bg-primary-hover"),
	agent: cx(btnBase, "h-10 px-5 bg-agent text-background hover:brightness-110"),
	outline: cx(btnBase, "h-10 px-5 border border-border-strong bg-card text-foreground hover:border-brand hover:text-brand"),
	ghost: cx(btnBase, "h-9 px-3 text-muted-foreground hover:bg-accent hover:text-foreground"),
	small: cx(btnBase, "h-8 px-3 text-[0.8125rem] border border-border bg-card text-foreground hover:border-border-strong"),
};

export function DemoButton({
	variant = "outline",
	className,
	...props
}: ComponentProps<typeof Button> & { variant?: keyof typeof btn; className?: string }) {
	return <Button className={cx(btn[variant], className)} {...props} />;
}

/* Popup surfaces share the .demo-popup structure (demos.css); these add the
   inner padding and item states. */
export const popup = "demo-popup p-1.5 min-w-44";
export const popupWide = "demo-popup p-1.5";

export const item =
	"flex cursor-default items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-foreground outline-none data-[highlighted]:bg-accent data-[disabled]:pointer-events-none data-[disabled]:opacity-50";

export const fieldLabel = "block text-[0.8125rem] font-medium text-foreground";
export const fieldHint = "text-xs text-muted-foreground";

export const input =
	"h-10 w-full rounded-lg border border-border-strong bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:border-brand focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring";

export const selectTrigger =
	"flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-border-strong bg-card px-3 text-sm text-foreground transition-colors hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-[placeholder]:text-muted-foreground";

export function ChevronDown({ className = "h-4 w-4" }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={cx("shrink-0 text-muted-foreground", className)}>
			<path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

export function Check({ className = "h-4 w-4" }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
			<path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

export function SearchIcon({ className = "h-4 w-4" }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
			<circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
			<path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
		</svg>
	);
}

export function CopyIcon({ className = "h-4 w-4" }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
			<rect x="5.5" y="5.5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
			<path d="M10.5 5.5v-1a1.5 1.5 0 0 0-1.5-1.5h-4.5a1.5 1.5 0 0 0-1.5 1.5v4.5a1.5 1.5 0 0 0 1.5 1.5h1" stroke="currentColor" strokeWidth="1.5" />
		</svg>
	);
}

export function Field({
	label,
	hint,
	htmlFor,
	children,
	className,
}: {
	label: ReactNode;
	hint?: ReactNode;
	htmlFor?: string;
	children: ReactNode;
	className?: string;
}) {
	return (
		<div className={cx("flex flex-col gap-1.5", className)}>
			<label htmlFor={htmlFor} className={fieldLabel}>
				{label}
			</label>
			{children}
			{hint && <p className={fieldHint}>{hint}</p>}
		</div>
	);
}