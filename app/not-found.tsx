import Link from "next/link";

export default function NotFound() {
 return (
  <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
   <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--color-text-muted)">404</p>
   <h1 className="mt-4 text-5xl font-bold tracking-tight text-(--color-text) md:text-6xl">Page not found</h1>
   <p className="mt-4 text-lg text-(--color-text-muted)">
    The page you&apos;re looking for doesn&apos;t exist or has been moved.
   </p>
   <Link
    href="/"
    className="mt-8 inline-flex items-center gap-2 rounded-full bg-(--color-brand) px-6 py-3 text-sm font-semibold text-(--color-brand-foreground) transition hover:opacity-90"
   >
    Go Home
   </Link>
  </div>
 );
}
