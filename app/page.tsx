import FolderCard from "@/components/navigation/FolderCard";
import { FOLDER_LAYOUT } from "@/components/navigation/FolderCard";
import FolderStack from "@/components/navigation/FolderStack";
import ContactLead from "@/components/sections/ContactLead";
import ContactPanel from "@/components/sections/ContactPanel";
import HeroBranding from "@/components/sections/HeroBranding";
import HeroLead from "@/components/sections/HeroLead";
import JsonLd from "@/components/seo/JsonLd";
import { personJsonLd } from "@/lib/seo";
import { getFeaturedProjects } from "@/lib/data/projects";
import { getFeaturedBlogPosts } from "@/lib/data/blog-posts";
import type { FolderTone } from "@/components/navigation/FolderCard";

interface FolderConfig {
 href: string;
 label: string;
 title: string;
 description: string;
 tone: FolderTone;
 detail?: string;
 detailKey?: "projects" | "blog";
 heroToggleId?: string;
}

const CONTACT_OPEN_QUERY = "open";

const folders: FolderConfig[] = [
 {
  href: "/?contact=open",
  label: "Contact",
  title: "Get in touch",
  description: "Questions, projects, or just want to say hello.",
  tone: "lava",
  heroToggleId: "contact",
 },
 {
  href: "/blog",
  label: "Blog",
  title: "Writing",
  description: "Notes on frontend architecture, developer tooling, and software craft.",
  tone: "lavender",
  detailKey: "blog",
 },
 {
  href: "/about",
  label: "About",
  title: "A bit about me",
  description: "Engineer first, designer when needed.",
  tone: "copper",
 },
 {
  href: "/projects",
  label: "Projects",
  title: "Things I’ve built",
  description: "Full-stack platforms, developer tools, and open source work.",
  tone: "evergreen",
  detailKey: "projects",
 },
];

interface HomePageProps {
 searchParams: Promise<{ contact?: string | string[] }>;
}

/**
 * Hero composition for cards that can occupy the front position. Includes
 * the right-side wordmark (`<HeroBranding />`) so it always rides with the
 * active hero — currently projects (default) and contact (when toggled).
 */
function ProjectsHero() {
 return (
  <div className="relative h-full">
   <HeroLead />
   <div className="pointer-events-none absolute bottom-0 right-0">
    <div className="pointer-events-auto">
     <HeroBranding />
    </div>
   </div>
  </div>
 );
}

function ContactHero() {
 return (
  <div className="relative h-full">
   <ContactPanel />
  </div>
 );
}

export default async function HomePage({ searchParams }: HomePageProps) {
 const projects = getFeaturedProjects(3);
 const posts = getFeaturedBlogPosts(3);

 const detailMap: Record<string, string> = {
  projects: `${projects.length} featured projects`,
  blog: `${posts.length} recent articles`,
 };

 const params = await searchParams;
 const contactParam = Array.isArray(params.contact) ? params.contact[0] : params.contact;
 const initialHeroId = contactParam === CONTACT_OPEN_QUERY ? "contact" : null;

 return (
  <>
   <JsonLd data={personJsonLd()} />

   {/* Folder stack — positioned at ~15% from the top so the wider peekGap fits */}
   <div className="bg-atmosphere flex h-screen w-screen justify-center overflow-hidden pt-[15vh]">
    <FolderStack initialHeroId={initialHeroId}>
     <div
      className="relative w-[85%] max-w-5xl"
      style={{
       height: `calc(${(folders.length - 1) * FOLDER_LAYOUT.peekGap}px + ${FOLDER_LAYOUT.bodyHeight})`,
      }}
     >
      {folders.map((folder, i) => {
       const heroContent =
        folder.heroToggleId === "contact" ? <ContactHero /> : folder.label === "Projects" ? <ProjectsHero /> : undefined;

       // Peek (non-hero) lead. Contact gets its custom ContactLead; everyone else
       // (including projects when it's not the hero) uses the default title+desc.
       const lead = folder.heroToggleId === "contact" ? <ContactLead /> : undefined;

       return (
        <FolderCard
         key={folder.label}
         href={folder.href}
         label={folder.label}
         title={folder.title}
         description={folder.description}
         detail={folder.detail ?? (folder.detailKey ? detailMap[folder.detailKey] : undefined)}
         tone={folder.tone}
         index={i}
         total={folders.length}
         lead={lead}
         heroToggleId={folder.heroToggleId}
         heroContent={heroContent}
        />
       );
      })}
     </div>
    </FolderStack>
   </div>
  </>
 );
}
