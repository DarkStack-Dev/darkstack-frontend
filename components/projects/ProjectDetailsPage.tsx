// components/projects/ProjectDetailsPage.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  Eye, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Download
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useProject } from "@/hooks/useProjects";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { Project } from "@/types/projects/projects";

interface ProjectDetailsPageProps {
  projectId: string;
}

export const ProjectDetailsPage = ({ projectId }: ProjectDetailsPageProps) => {
  const router = useRouter();
  const { project, loading, error } = useProject(projectId);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const nextImage = () => {
    if (project && project.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === project.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (project && project.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? project.images.length - 1 : prev - 1
      );
    }
  };

  const downloadImage = (image: any) => {
    const link = document.createElement('a');
    link.href = image.url || `data:image/${image.type.toLowerCase()};base64,${image.base64}`;
    link.download = image.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="aspect-video rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">Projeto não encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {error || "O projeto que você está procurando não existe ou foi removido."}
            </p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentImage = project.images[currentImageIndex];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/projects" className="hover:text-foreground">
          Projetos
        </Link>
        <span>/</span>
        <span className="text-foreground">{project.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <ProjectStatusBadge status={project.status} />
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Criado em {formatDate(project.createdAt)}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {project.participantCount} participantes
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {project.imageCount} imagens
            </div>
          </div>
        </div>

        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="relative aspect-video">
              {currentImage && (
                <Image
                  src={currentImage.url || `data:image/${currentImage.type.toLowerCase()};base64,${currentImage.base64}`}
                  alt={currentImage.filename}
                  fill
                  className="object-cover"
                />
              )}
              
              {/* Navigation */}
              {project.images.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={nextImage}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}

              {/* Image counter */}
              {project.images.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {currentImageIndex + 1} / {project.images.length}
                </div>
              )}

              {/* Download button */}
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => downloadImage(currentImage)}
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          {/* Thumbnails */}
          {project.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {project.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    currentImageIndex === index 
                      ? 'border-primary' 
                      : 'border-transparent hover:border-muted-foreground'
                  }`}
                >
                  <Image
                    src={image.url || `data:image/${image.type.toLowerCase()};base64,${image.base64}`}
                    alt={image.filename}
                    fill
                    className="object-cover"
                  />
                  {image.isMain && (
                    <Badge className="absolute top-1 left-1 text-xs">
                      Principal
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Project Info */}
        <div className="space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Descrição</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {project.description}
              </p>
            </CardContent>
          </Card>

          {/* Owner Info */}
          <Card>
            <CardHeader>
              <CardTitle>Criador</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={project.owner.avatar} />
                  <AvatarFallback>
                    {project.owner.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{project.owner.name}</p>
                  <p className="text-sm text-muted-foreground">{project.owner.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Status Info */}
          {project.status === 'APPROVED' && project.approvedAt && (
            <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                  <Badge variant="default" className="bg-green-600">
                    Aprovado
                  </Badge>
                  <span className="text-sm">
                    em {formatDate(project.approvedAt)}
                  </span>
                </div>
                {project.approvedBy && (
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Por: {project.approvedBy.name}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {project.status === 'REJECTED' && project.rejectionReason && (
            <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="text-red-800 dark:text-red-200">
                  Projeto Rejeitado
                </CardTitle>
              </CardHeader>
              <CardContent className="text-red-700 dark:text-red-300">
                <p className="text-sm">{project.rejectionReason}</p>
              </CardContent>
            </Card>
          )}

          {project.status === 'PENDING' && (
            <Card className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                  <Badge variant="secondary" className="bg-yellow-600 text-white">
                    Aguardando Moderação
                  </Badge>
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Este projeto está sendo analisado pela equipe de moderação.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          {project.isOwner && (
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    Editar Projeto
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Gerenciar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};