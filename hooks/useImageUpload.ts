// hooks/useImageUpload.ts
import { useState } from 'react';
import { fileToBase64, getImageTypeFromFile } from '@/lib/schemas/projectSchemas';
import { toast } from 'sonner';

export type ImagePreview = {
  id: string;
  file: File;
  preview: string;
  isMain: boolean;
};

export const useImageUpload = (maxImages = 5) => {
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [uploading, setUploading] = useState(false);

  const addImages = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);

    if (images.length + fileArray.length > maxImages) {
      toast.error(`Máximo de ${maxImages} imagens permitidas`);
      return;
    }

    fileArray.forEach((file) => {
      // Validar tipo
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
        toast.error(`Arquivo ${file.name} não é uma imagem válida`);
        return;
      }

      // Validar tamanho (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`Arquivo ${file.name} é muito grande (máximo 10MB)`);
        return;
      }

      const preview: ImagePreview = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
        isMain: images.length === 0 // Primeira imagem é principal por padrão
      };

      setImages(prev => [...prev, preview]);
    });
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      // Se removeu a imagem principal e ainda há imagens, torna a primeira como principal
      if (filtered.length > 0 && !filtered.some(img => img.isMain)) {
        filtered[0].isMain = true;
      }
      return filtered;
    });
  };

  const setMainImage = (id: string) => {
    setImages(prev => prev.map(img => ({
      ...img,
      isMain: img.id === id
    })));
  };

  const processImages = async () => {
    setUploading(true);
    
    try {
      const processedImages = await Promise.all(
        images.map(async (img) => ({
          filename: img.file.name,
          type: getImageTypeFromFile(img.file),
          base64: await fileToBase64(img.file),
          isMain: img.isMain
        }))
      );
      
      return processedImages;
    } catch (error) {
      toast.error('Erro ao processar imagens');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const clearImages = () => {
    // Limpar URLs de preview para evitar memory leaks
    images.forEach(img => URL.revokeObjectURL(img.preview));
    setImages([]);
  };

  return {
    images,
    uploading,
    addImages,
    removeImage,
    setMainImage,
    processImages,
    clearImages
  };
};