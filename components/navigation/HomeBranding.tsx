import SocialLinks from "@/components/ui/SocialLinks";

export default function HomeBranding() {
 return (
  <div className="flex flex-col items-end text-right">
   <h1 className="text-2xl font-black tracking-tight text-(--color-text) md:text-3xl lg:text-4xl">
    Rijad Rajkic
   </h1>
   <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-(--color-text-muted)/60 md:text-sm">
    Software Engineer
   </p>
   <div className="pointer-events-auto">
    <SocialLinks className="mt-3 flex items-center justify-end gap-3" iconClassName="h-5 w-5" />
   </div>
  </div>
 );
}
