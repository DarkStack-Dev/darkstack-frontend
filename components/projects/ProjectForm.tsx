// components/projects/ProjectForm.tsx - CORRIGIDO
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { createProjectSchema, CreateProjectData, ProjectImageData } from "@/lib/schemas/projectSchemas";
import { ImageUpload } from "./ImageUpload";
import { useCreateProject } from "@/hooks/useProjects";
import { Save, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export const ProjectForm = () => {
  const router = useRouter();
  const { create, loading } = useCreateProject();

  // ✅ CORRIGIDO: Usando os tipos corretos
  const form = useForm<CreateProjectData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      images: []
    }
  });

  // ✅ CORRIGIDO: Função para atualizar imagens
  const handleImagesChange = (newImages: ProjectImageData[]) => {
    form.setValue('images', newImages, { shouldValidate: true });
  };

  const onSubmit = async (data: CreateProjectData) => {
    const result = await create(data);
    
    if (result.success) {
      router.push('/projects/my-projects');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Criar Novo Projeto</CardTitle>
          <p className="text-muted-foreground">
            Compartilhe seu projeto com a comunidade. Após criar, ele passará por moderação antes de ser publicado.
          </p>
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
                    <FormLabel>Nome do Projeto *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Digite o nome do seu projeto..."
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
                    <FormLabel>Descrição *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva seu projeto, tecnologias utilizadas, objetivos..."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      {field.value?.length || 0}/1000 caracteres
                    </p>
                  </FormItem>
                )}
              />

              {/* Upload de Imagens */}
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imagens do Projeto *</FormLabel>
                    <FormControl>
                      <ImageUpload
                        images={field.value}
                        onImagesChange={handleImagesChange}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      Adicione entre 1 e 5 imagens. A primeira será a imagem principal.
                    </p>
                  </FormItem>
                )}
              />

              {/* Botões */}
              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Criar Projeto
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Card informativo */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            ℹ️ Processo de Moderação
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Seu projeto será analisado por nossa equipe de moderação</li>
            <li>• O processo pode levar até 48 horas úteis</li>
            <li>• Você será notificado sobre a aprovação ou rejeição</li>
            <li>• Projetos aprovados ficam visíveis publicamente</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};