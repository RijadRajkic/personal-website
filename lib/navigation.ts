export type NavItem = {
 label: string;
 href: string;
 key: string;
};

export const navItems: NavItem[] = [
 { key: "home", label: "Home", href: "/" },
 { key: "about", label: "About", href: "/about" },
 { key: "projects", label: "Projects", href: "/projects" },
 { key: "blog", label: "Blog", href: "/blog" },
 { key: "contact", label: "Contact", href: "/?contact=open" },
];

export function getActiveNavKey(pathname: string): string {
 if (pathname.startsWith("/blog")) {
  return "blog";
 }
 if (pathname.startsWith("/projects")) {
  return "projects";
 }
 if (pathname.startsWith("/about")) {
  return "about";
 }
 return "home";
}
