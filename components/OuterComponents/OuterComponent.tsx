import { useState } from "react";
import { useRouter } from "next/router";

interface CornerComponentProps {
 corner: "top-left" | "top-right" | "bottom-left" | "bottom-right";
 link?: string;
 label?: string;
}

export const OuterComponent = ({ corner, link, label }: CornerComponentProps) => {
 const [effect, setEffect] = useState(false);
 const router = useRouter();
 let outerCornerStyle = "";

 switch (corner) {
  case "top-left":
   outerCornerStyle = "rounded-tl-lg";
   break;
  case "top-right":
   outerCornerStyle = "rounded-tr-lg";
   break;
  case "bottom-left":
   outerCornerStyle = "rounded-bl-lg";
   break;
  case "bottom-right":
   outerCornerStyle = "rounded-br-lg";
   break;
  default:
   break;
 }

 const handleClick = () => {
  setEffect(true);
  setTimeout(() => {
   if (link) {
    if (link.startsWith("http")) {
     window.location.href = link;
    } else {
     router.push(`/${link}`);
    }
   }
  }, 600);
 };

 return (
  <button
   className={`bg-white p-4 w-full h-[50%] border-rose-600 ${effect ? "animate-hoverPop" : ""} ${outerCornerStyle}`}
   onClick={handleClick}
  >
   <div className="flex justify-center items-center h-full">{label}</div>
  </button>
 );
};
