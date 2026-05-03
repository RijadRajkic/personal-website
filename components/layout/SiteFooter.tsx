import Link from "next/link";
import SocialLinks from "@/components/ui/SocialLinks";

export default function SiteFooter() {
 return (
  <footer className="border-t border-(--color-border) bg-almond-cream-950 py-10 text-almond-cream-100">
   <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 md:flex-row md:items-end md:justify-between md:px-8">
    <div>
     <p className="text-2xl font-bold tracking-tight">Rijad Rajkic</p>
     <p className="mt-2 max-w-md text-sm text-almond-cream-100/75">
      Software engineer building full-stack web applications with TypeScript, React, and Next.js.
     </p>
    </div>

    <div className="flex flex-wrap items-center gap-5">
     <div className="flex flex-wrap gap-5 text-sm font-semibold uppercase tracking-[0.08em]">
      <Link href="/" className="text-almond-cream-100/80 transition hover:text-almond-cream-100">
       Home
      </Link>
      <Link href="/about" className="text-almond-cream-100/80 transition hover:text-almond-cream-100">
       About
      </Link>
      <Link href="/projects" className="text-almond-cream-100/80 transition hover:text-almond-cream-100">
       Projects
      </Link>
      <Link href="/blog" className="text-almond-cream-100/80 transition hover:text-almond-cream-100">
       Blog
      </Link>
      <Link href="/contact" className="text-almond-cream-100/80 transition hover:text-almond-cream-100">
       Contact
      </Link>
     </div>

     <SocialLinks linkClassName="text-almond-cream-100/60 transition hover:text-almond-cream-100" />
    </div>
   </div>

   <div className="mx-auto mt-8 max-w-6xl border-t border-almond-cream-100/20 px-5 pt-6 text-xs text-almond-cream-100/65 md:px-8">
    <p>&copy; {new Date().getFullYear()} Rijad Rajkic. All rights reserved.</p>
   </div>
  </footer>
 );
}
