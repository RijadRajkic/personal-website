import { CURRENTLY_BUILDING } from "@/lib/site-config";

/**
 * Right-aligned wordmark that lives in whichever card is currently the hero.
 * Pulsing-dot status line, name, role.
 */
export default function HeroBranding() {
 return (
  <div className="flex flex-col items-end gap-3">
   <p className="inline-flex items-center gap-2 text-[0.6rem] font-medium uppercase tracking-[0.25em] text-(--color-text-muted)/80 md:text-xs">
    <span
     className="size-1.5 rounded-full bg-evergreen-400 shadow-[0_0_0_3px_rgba(86,196,152,0.18)] motion-safe:animate-pulse"
     aria-hidden
    />
    Currently building {CURRENTLY_BUILDING}
   </p>
   <div className="text-right">
    <h1 className="text-2xl font-black tracking-tight text-(--color-text) md:text-3xl lg:text-4xl">
     Rijad Rajkic
    </h1>
    <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-(--color-text-muted)/60 md:text-sm">
     Software Engineer
    </p>
   </div>
  </div>
 );
}
