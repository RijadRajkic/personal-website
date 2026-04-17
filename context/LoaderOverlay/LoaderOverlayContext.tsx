import { ReactNode, createContext } from 'react';

export interface LoaderOverlayContextProps {
  showLoader: (isLoading: boolean, loaderNodeToShow?: ReactNode) => void;
}

export const LoaderOverlayContext = createContext<LoaderOverlayContextProps>({
  showLoader: (isLoading: boolean, loaderNodeToShow?: ReactNode) => {},
});
