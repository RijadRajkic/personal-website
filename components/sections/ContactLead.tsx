import { SOCIAL_LINKS } from "@/lib/site-config";

export default function ContactLead() {
 return (
  <>
   <h2 className="text-lg font-bold tracking-tight text-(--color-text) md:text-xl lg:text-2xl">
    Get in touch
   </h2>
   <p className="folder-peek-extra mt-1 max-w-lg text-xs text-(--color-text-muted) md:text-sm">
    Questions, projects, or just want to say hello.
   </p>
   <p className="folder-peek-extra mt-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-molten-lava-400">
    {SOCIAL_LINKS.email}
   </p>
  </>
 );
}
