export default function HeroLead() {
 return (
  <div className="flex h-full flex-col gap-3 md:gap-4">
   <h1 className="text-2xl font-bold tracking-tight text-(--color-text) md:text-3xl lg:text-4xl">
    Things I&apos;ve built.
   </h1>

   <p className="max-w-[42ch] text-xs leading-relaxed text-(--color-text-muted) md:text-sm">
    Dispatch panels, payment pipelines, warehouse floors, telemetry dashboards
    &mdash; the operational software that quietly keeps businesses moving across
    transport, HR, fintech, warehousing, and energy.
   </p>
  </div>
 );
}
