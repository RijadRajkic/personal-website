import type { ReactNode } from "react";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

export default function PagesLayout({ children }: { children: ReactNode }) {
 return (
  <div className="relative min-h-screen bg-atmosphere">
   <SiteHeader />
   <main>{children}</main>
   <SiteFooter />
  </div>
 );
}
