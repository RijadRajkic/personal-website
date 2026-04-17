import { ReactNode } from "react";
import { Box } from "./Box";

interface NavMenuWrapperProps {
 children?: ReactNode;
}

export const NavMenuWrapper = ({ children }: NavMenuWrapperProps) => {
 return (
  <Box className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
   <ul className="py-2">{children}</ul>
  </Box>
 );
};
