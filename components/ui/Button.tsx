import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "accent";
type ButtonSize = "sm" | "md" | "lg";

interface BaseProps {
 children: ReactNode;
 className?: string;
 variant?: ButtonVariant;
 size?: ButtonSize;
}

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>;
type ButtonLinkProps = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

const variantClasses: Record<ButtonVariant, string> = {
 primary: "bg-(--color-brand) text-(--color-brand-foreground) hover:opacity-90 focus-visible:outline-(--color-brand)",
 secondary:
  "bg-almond-cream-950 text-almond-cream-100 hover:bg-almond-cream-950/90 focus-visible:outline-almond-cream-950",
 ghost:
  "bg-transparent text-(--color-text) border border-(--color-border) hover:bg-(--color-surface) focus-visible:outline-(--color-brand)",
 accent:
  "bg-dusty-lavender-600 text-dusty-lavender-50 hover:bg-dusty-lavender-600/90 focus-visible:outline-dusty-lavender-600",
};

const sizeClasses: Record<ButtonSize, string> = {
 sm: "px-4 py-2 text-sm",
 md: "px-6 py-3 text-sm md:text-base",
 lg: "px-7 py-3.5 text-base md:text-lg",
};

function classes(variant: ButtonVariant, size: ButtonSize, className: string): string {
 return `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
}

export function Button({ children, className = "", variant = "primary", size = "md", ...props }: ButtonProps) {
 return (
  <button className={classes(variant, size, className)} {...props}>
   {children}
  </button>
 );
}

export function ButtonLink({
 children,
 className = "",
 variant = "primary",
 size = "md",
 href,
 ...props
}: ButtonLinkProps) {
 const isExternal = href.startsWith("http") || href.startsWith("mailto:");

 if (isExternal) {
  return (
   <a href={href} className={classes(variant, size, className)} {...props}>
    {children}
   </a>
  );
 }

 return (
  <Link href={href} className={classes(variant, size, className)} {...props}>
   {children}
  </Link>
 );
}
