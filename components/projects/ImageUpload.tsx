// components/projects/ImageUpload.tsx - CORRIGIDO
"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Upload, Star, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { ProjectImageData, fileToBase64, getImageTypeFromFile } from "@/lib/schemas/projectSchemas";
import { toast } from "sonner";

interface ImageUploadProps {
  images: ProjectImageData[];
  onImagesChange: (images: ProjectImageData[]) => void;
  maxImages?: number;
  maxSize?: number; // em bytes
}

export const ImageUpload = ({ 
  images, 
  onImagesChange, 
  maxImages = 5,
  maxSize = 10 * 1024 * 1024 // 10MB
}: ImageUploadProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File): Promise<ProjectImageData> => {
    if (file.size > maxSize) {
      throw new Error(`Arquivo muito grande. Máximo ${maxSize / 1024 / 1024}MB`);
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Tipo de arquivo não suportado');
    }

    try {
      const base64Data = await fileToBase64(file);
      const imageType = getImageTypeFromFile(file);
      
      return {
        filename: file.name,
        type: imageType,
        base64: base64Data,
        isMain: images.length === 0, // ✅ CORRIGIDO: Sempre boolean
        size: file.size
      };
    } catch (error) {
      throw new Error('Erro ao processar arquivo');
    }
  }, [images.length, maxSize]);

  const handleFiles = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files);
    
    if (images.length + fileArray.length > maxImages) {
      toast.error(`Máximo ${maxImages} imagens permitidas`);
      return;
    }

    try {
      const newImages: ProjectImageData[] = [];
      
      for (const file of fileArray) {
        try {
          const processedImage = await processFile(file);
          newImages.push(processedImage);
        } catch (error) {
          toast.error(`Erro no arquivo ${file.name}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        }
      }
      
      if (newImages.length > 0) {
        onImagesChange([...images, ...newImages]);
        toast.success(`${newImages.length} imagem(ns) adicionada(s)`);
      }
    } catch (error) {
      toast.error('Erro ao processar imagens');
    }
  }, [images, maxImages, onImagesChange, processFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    // Reset input value para permitir o mesmo arquivo novamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFiles]);

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    
    // Se removeu a imagem principal e ainda há imagens, marcar a primeira como principal
    if (images[index].isMain && newImages.length > 0) {
      newImages[0] = { ...newImages[0], isMain: true };
    }
    
    onImagesChange(newImages);
  };

  const setMainImage = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isMain: i === index
    }));
    onImagesChange(newImages);
  };

  const reorderImages = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    onImagesChange(newImages);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOverImage = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      reorderImages(draggedIndex, index);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {images.length < maxImages && (
        <Card
          className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
            isDragOver 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/svg+xml"
            onChange={handleFileInput}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">
                {isDragOver ? 'Solte as imagens aqui' : 'Clique ou arraste imagens'}
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, WEBP, GIF, SVG até {maxSize / 1024 / 1024}MB
              </p>
              <p className="text-xs text-muted-foreground">
                {images.length}/{maxImages} imagens
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <Card 
              key={index} 
              className="relative group overflow-hidden cursor-move"
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOverImage(e, index)}
              onDragEnd={handleDragEnd}
            >
              <div className="aspect-square relative">
                <Image
                  src={`data:image/${image.type.toLowerCase()};base64,${image.base64}`}
                  alt={image.filename}
                  fill
                  className="object-cover"
                />
                
                {/* Overlay com controles */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant={image.isMain ? "default" : "secondary"}
                    onClick={() => setMainImage(index)}
                  >
                    <Star className={`w-4 h-4 ${image.isMain ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeImage(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Badge de imagem principal */}
                {image.isMain && (
                  <Badge className="absolute top-2 left-2 bg-primary">
                    <Star className="w-3 h-3 fill-current mr-1" />
                    Principal
                  </Badge>
                )}

                {/* Badge de ordem */}
                <Badge variant="secondary" className="absolute top-2 right-2">
                  {index + 1}
                </Badge>
              </div>
              
              {/* Info da imagem */}
              <div className="p-2">
                <p className="text-xs truncate" title={image.filename}>
                  {image.filename}
                </p>
                <p className="text-xs text-muted-foreground">
                  {image.type} • {((image.size || 0) / 1024).toFixed(1)}KB
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Instruções */}
      {images.length > 0 && (
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Arraste as imagens para reordenar</p>
          <p>• Clique na estrela para marcar como imagem principal</p>
          <p>• A imagem principal será exibida como thumbnail</p>
        </div>
      )}
    </div>
  );
};