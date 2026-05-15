export type FolderKey = "about" | "projects" | "blog" | "now" | "contact";
export type FolderTone = "copper" | "evergreen" | "lavender" | "cream" | "lava";

export type FolderNavItem = {
 key: FolderKey;
 label: string;
 href: string;
 tone: FolderTone;
};

export const folderNavItems: FolderNavItem[] = [
 { key: "about",    label: "About",    href: "/about",         tone: "copper" },
 { key: "projects", label: "Projects", href: "/projects",      tone: "evergreen" },
 { key: "blog",     label: "Blog",     href: "/blog",          tone: "lavender" },
 { key: "now",      label: "Now",      href: "/now",           tone: "cream" },
 { key: "contact",  label: "Contact",  href: "/?contact=open", tone: "lava" },
];

export function getActiveFolder(pathname: string): FolderKey | null {
 if (pathname.startsWith("/blog")) return "blog";
 if (pathname.startsWith("/projects")) return "projects";
 if (pathname.startsWith("/about")) return "about";
 if (pathname.startsWith("/now")) return "now";
 return null;
}
