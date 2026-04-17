import { useContext } from 'react';
import { LoaderOverlayContext } from './LoaderOverlayContext';

export const useLoaderOverlay = () => {
  const context = useContext(LoaderOverlayContext);

  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }

  return context;
};
