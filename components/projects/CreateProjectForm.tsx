// components/projects/CreateProjectForm.tsx
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Upload, X, Star, Image as ImageIcon, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// ✅ CORRIGIDO: Importar CreateProjectData em vez de CreateProjectFormData
import { createProjectSchema, CreateProjectData, fileToBase64, getImageTypeFromFile } from '@/lib/schemas/projectSchemas';
import { createProject } from '@/lib/api/projects';

type ImagePreview = {
  id: string;
  file: File;
  preview: string;
  isMain: boolean;
};

export const CreateProjectForm = () => {
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  // ✅ CORRIGIDO: Usar CreateProjectData
  const form = useForm<CreateProjectData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      description: '',
      images: []
    }
  });

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const maxImages = 5;

    if (images.length + fileArray.length > maxImages) {
      toast.error(`Máximo de ${maxImages} imagens permitidas`);
      return;
    }

    fileArray.forEach((file) => {
      // Validar tipo e tamanho
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
        toast.error(`Arquivo ${file.name} não é uma imagem válida`);
        return;
      }

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

  // ✅ CORRIGIDO: Usar CreateProjectData
  const onSubmit = async (data: CreateProjectData) => {
    if (images.length === 0) {
      toast.error('Adicione pelo menos uma imagem');
      return;
    }

    try {
      setUploading(true);

      // Converter imagens para base64
      const imagePromises = images.map(async (img) => ({
        filename: img.file.name,
        type: getImageTypeFromFile(img.file),
        base64: await fileToBase64(img.file),
        isMain: img.isMain
      }));

      const processedImages = await Promise.all(imagePromises);

      const projectData = {
        ...data,
        images: processedImages
      };

      const response = await createProject(projectData);

      if (response.error) {
        toast.error(response.error.message);
        return;
      }

      toast.success('Projeto criado com sucesso! Aguarde aprovação dos moderadores.');
      router.push('/projects/my');
    } catch (error) {
      toast.error('Erro ao criar projeto');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-6 h-6" />
            Criar Novo Projeto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Nome do Projeto */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Projeto</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Digite o nome do seu projeto" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Descrição */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva seu projeto, tecnologias utilizadas, funcionalidades..."
                        className="min-h-32"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Upload de Imagens */}
              <div className="space-y-4">
                <FormLabel>Imagens do Projeto (1-5 imagens)</FormLabel>
                
                {/* Área de Upload */}
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Clique para selecionar imagens ou arraste aqui
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, WEBP até 10MB cada
                    </p>
                  </label>
                </div>

                {/* Preview das Imagens */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image) => (
                      <div key={image.id} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                          <img
                            src={image.preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Botões de ação */}
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Button
                            type="button"
                            variant={image.isMain ? "default" : "secondary"}
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setMainImage(image.id)}
                            title="Definir como imagem principal"
                          >
                            <Star className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => removeImage(image.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Indicador de imagem principal */}
                        {image.isMain && (
                          <div className="absolute bottom-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                            Principal
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Informação sobre aprovação */}
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex gap-3">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">!</span>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                      Sobre a Aprovação
                    </p>
                    <p className="text-blue-800 dark:text-blue-200">
                      Seu projeto será analisado pelos moderadores antes de ficar público. 
                      Certifique-se de que as imagens e descrição estejam adequadas às diretrizes da comunidade.
                    </p>
                  </div>
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={uploading}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={uploading || images.length === 0}
                  className="flex-1"
                >
                  {uploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {uploading ? 'Criando...' : 'Criar Projeto'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};