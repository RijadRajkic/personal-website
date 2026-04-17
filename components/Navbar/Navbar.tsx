import React, { useState, useEffect, useRef } from "react";

import { MenuItem } from "./MenuContent";
import { Menu } from "@/public/icons";
import { NavMenuWrapper } from "@/components";

export const Navbar = () => {
 const [isMenuOpen, setIsMenuOpen] = useState(false);
 const menuRef = useRef<HTMLDivElement>(null);

 const toggleMenu = () => {
  setIsMenuOpen(!isMenuOpen);
 };

 useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
   if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
    setIsMenuOpen(false);
   }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
   document.removeEventListener("mousedown", handleClickOutside);
  };
 }, []);

 return (
  <nav className="flex justify-between items-center h-16 text-text">
   <div className="text-4xl font-semibold">Rijad Rajkic</div>
   <div className="relative" ref={menuRef}>
    <Menu className="text-accent h-8 cursor-pointer" onClick={toggleMenu} />
    {isMenuOpen && (
     <NavMenuWrapper>
      <MenuItem label="About Me" link="about-me" />
      <MenuItem label="Contact" link="contact" />
      <MenuItem label="Resume" link="resume" />
     </NavMenuWrapper>
    )}
   </div>
  </nav>
 );
};
