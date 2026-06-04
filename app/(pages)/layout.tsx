import type { ReactNode } from "react";
import FolderShell from "@/components/layout/FolderShell";

export default function PagesLayout({ children }: { children: ReactNode }) {
 return <FolderShell>{children}</FolderShell>;
}
