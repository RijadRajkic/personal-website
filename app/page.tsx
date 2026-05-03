import FolderCard, { FOLDER_LAYOUT, type FolderTone } from "@/components/navigation/FolderCard";
import FolderStack from "@/components/navigation/FolderStack";
import HomeBranding from "@/components/navigation/HomeBranding";
import JsonLd from "@/components/seo/JsonLd";
import SocialLinks from "@/components/ui/SocialLinks";
import { personJsonLd } from "@/lib/seo";
import { getFeaturedProjects } from "@/lib/data/projects";
import { getFeaturedBlogPosts } from "@/lib/data/blog-posts";

interface HomeFolder {
 href: string;
 label: string;
 title: string;
 description: string;
 tone: FolderTone;
 detail?: string;
 teaser?: React.ReactNode;
}

function formatDate(iso: string): string {
 return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function HomePage() {
 const featuredProjects = getFeaturedProjects(3);
 const featuredPosts = getFeaturedBlogPosts(2);

 const folders: HomeFolder[] = [
  {
   href: "/contact",
   label: "Contact",
   title: "Get in touch",
   description: "Questions, projects, or just want to say hello.",
   tone: "lava",
   teaser: (
    <div className="text-left">
     <p className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-molten-lava-400">Reach me on</p>
     <SocialLinks className="mt-2 flex items-center gap-3" iconClassName="h-5 w-5" />
    </div>
   ),
  },
  {
   href: "/about",
   label: "About",
   title: "A bit about me",
   description: "Engineer first, designer when needed.",
   tone: "copper",
   teaser: (
    <div className="text-left">
     <p className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-copper-400">Currently</p>
     <p className="mt-1 text-xs text-(--color-text-muted) md:text-sm">TypeScript · React · Next.js</p>
    </div>
   ),
  },
  {
   href: "/blog",
   label: "Blog",
   title: "Writing",
   description: "Notes on frontend architecture, developer tooling, and software craft.",
   tone: "lavender",
   detail: `${featuredPosts.length} recent articles`,
   teaser: (
    <ul className="space-y-1.5 text-left">
     {featuredPosts.map((post) => (
      <li key={post.slug} className="flex items-baseline justify-between gap-4">
       <span className="truncate text-xs text-(--color-text) md:text-sm">{post.title}</span>
       <span className="shrink-0 text-[0.6rem] uppercase tracking-[0.2em] text-(--color-text-muted)/70">
        {formatDate(post.publishedAt)}
       </span>
      </li>
     ))}
    </ul>
   ),
  },
  {
   href: "/projects",
   label: "Projects",
   title: "Things I\u2019ve built",
   description: "Full-stack platforms, developer tools, and open source work.",
   tone: "evergreen",
   detail: `${featuredProjects.length} featured projects`,
  },
 ];

 const stackHeight = `calc(${(folders.length - 1) * FOLDER_LAYOUT.peekGap}px + ${FOLDER_LAYOUT.tabH}px + clamp(340px, 45vh, 520px))`;

 return (
  <>
   <JsonLd data={personJsonLd()} />

   <div className="bg-atmosphere flex h-screen w-screen justify-center overflow-hidden pt-[25vh]">
    <FolderStack>
     <div className="relative w-[85%] max-w-5xl" style={{ height: stackHeight }}>
      {folders.map((folder, i) => {
       const isHero = i === folders.length - 1;
       return (
        <FolderCard
         key={folder.href}
         href={folder.href}
         label={folder.label}
         title={folder.title}
         description={folder.description}
         detail={folder.detail}
         tone={folder.tone}
         index={i}
         total={folders.length}
        >
         {isHero ? <HomeBranding /> : folder.teaser}
        </FolderCard>
       );
      })}
     </div>
    </FolderStack>
   </div>
  </>
 );
}

