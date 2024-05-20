import React from "react";

export const Footer = () => {
 return (
  <footer className="flex justify-center items-center h-16 border-t-2 border-accent text-text">
   <p className="text-sm">&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
  </footer>
 );
};
