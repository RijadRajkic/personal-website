import React, { ReactNode, useState } from "react";
import { LoaderOverlayContext } from "./LoaderOverlayContext";
import { Box, Loader } from "@/components";

interface LoaderOverlayProviderProps {
 children?: ReactNode;
}

export const LoaderOverlayProvider = ({ children }: LoaderOverlayProviderProps) => {
 const [isShowLoader, setIsLoading] = useState<boolean>();
 const [loaderNode, setLoaderNode] = useState<ReactNode | undefined>();

 const showLoader = (isLoading: boolean, loaderNodeToShow?: ReactNode) => {
  setIsLoading(isLoading);
  setLoaderNode(loaderNodeToShow);
 };

 return (
  <LoaderOverlayContext.Provider value={{ showLoader }}>
   {isShowLoader && (
    <Box className=" gap-5 absolute top-0 left-0 opacity-[0.7] w-screen h-screen bg-black">
     {!loaderNode && <Loader />}
     {loaderNode}
    </Box>
   )}
   {children}
  </LoaderOverlayContext.Provider>
 );
};
