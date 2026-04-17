import { useRouter } from "next/router";
import { useLoaderOverlay } from "@/context";

interface MenuContentProps {
 label: string;
 link?: string;
}

export const MenuItem = ({ link, label }: MenuContentProps) => {
 const router = useRouter();
 const { showLoader } = useLoaderOverlay();

 const handleClick = () => {
  showLoader(true);
  setTimeout(() => {
   if (link) {
    if (link.startsWith("http")) {
     window.location.href = link;
    } else {
     router.push(`/${link}`);
    }
   }
  }, 600);
  showLoader(true);
 };

 return (
  <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={handleClick}>
   {label}
  </li>
 );
};
