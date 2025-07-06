// hooks/useImagePreview.ts
import { useState, useCallback } from 'react';

interface ImagePreviewState {
  isOpen: boolean;
  currentIndex: number;
  images: Array<{
    url: string;
    alt: string;
    filename?: string;
  }>;
}

export const useImagePreview = () => {
  const [state, setState] = useState<ImagePreviewState>({
    isOpen: false,
    currentIndex: 0,
    images: []
  });

  const openPreview = useCallback((images: ImagePreviewState['images'], startIndex = 0) => {
    setState({
      isOpen: true,
      currentIndex: startIndex,
      images
    });
  }, []);

  const closePreview = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);

  const nextImage = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentIndex: prev.currentIndex === prev.images.length - 1 ? 0 : prev.currentIndex + 1
    }));
  }, []);

  const prevImage = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentIndex: prev.currentIndex === 0 ? prev.images.length - 1 : prev.currentIndex - 1
    }));
  }, []);

  const goToImage = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      currentIndex: Math.max(0, Math.min(index, prev.images.length - 1))
    }));
  }, []);

  return {
    ...state,
    openPreview,
    closePreview,
    nextImage,
    prevImage,
    goToImage
  };
};