import React from "react";
import { Menu } from "@/public/icons";

export const Navbar = () => {
 return (
  <nav className="flex justify-between items-center h-16 text-text">
   <div className="text-4xl font-semibold">Rijad Rajkic</div>
   <Menu className="text-accent h-8" />
  </nav>
 );
};
