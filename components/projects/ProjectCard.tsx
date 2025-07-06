// components/projects/ProjectCard.tsx
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Project } from "@/types/projects/projects";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Users, Calendar, MoreHorizontal, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { usePermissions } from "@/hooks/usePermissions";

interface ProjectCardProps {
  project: Project;
  showOwner?: boolean;
  showActions?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onDelete?: (id: string) => void;
  variant?: 'default' | 'compact';
}

export const ProjectCard = ({ 
  project, 
  showOwner = true, 
  showActions = false,
  onApprove,
  onReject,
  onDelete,
  variant = 'default'
}: ProjectCardProps) => {
  const { canEditContent } = usePermissions();
  const mainImage = project.images.find(img => img.isMain) || project.images[0];

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  if (variant === 'compact') {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {mainImage && (
              <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={mainImage.url || `data:image/${mainImage.type.toLowerCase()};base64,${mainImage.base64}`}
                  alt={project.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-sm truncate">{project.name}</h3>
                <ProjectStatusBadge status={project.status} size="sm" />
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                {project.description}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  {showOwner && (
                    <span className="truncate">{project.owner.name}</span>
                  )}
                  <span>{formatDate(project.createdAt)}</span>
                </div>
                <Link href={`/projects/${project.id}`}>
                  <Button size="sm" variant="ghost">
                    <Eye className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-200 group">
      <CardHeader className="p-0">
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
          {mainImage ? (
            <Image
              src={mainImage.url || `data:image/${mainImage.type.toLowerCase()};base64,${mainImage.base64}`}
              alt={project.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">Sem imagem</span>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <ProjectStatusBadge status={project.status} size="sm" />
          </div>
          {project.imageCount > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
              +{project.imageCount - 1} fotos
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {project.name}
            </h3>
            {(showActions && canEditContent()) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {project.status === 'PENDING' && onApprove && (
                    <DropdownMenuItem onClick={() => onApprove(project.id)}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Aprovar
                    </DropdownMenuItem>
                  )}
                  {project.status === 'PENDING' && onReject && (
                    <DropdownMenuItem onClick={() => onReject(project.id)}>
                      <XCircle className="w-4 h-4 mr-2" />
                      Rejeitar
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem 
                      onClick={() => onDelete(project.id)}
                      className="text-destructive"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Deletar
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <p className="text-muted-foreground text-sm line-clamp-2">
            {project.description}
          </p>

          {showOwner && (
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={project.owner.avatar} />
                <AvatarFallback className="text-xs">
                  {project.owner.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground truncate">
                {project.owner.name}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{project.participantCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(project.createdAt)}</span>
              </div>
            </div>
          </div>

          {project.status === 'REJECTED' && project.rejectionReason && (
            <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 p-2 rounded">
              <strong>Motivo da rejeição:</strong> {project.rejectionReason}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link href={`/projects/${project.id}`} className="w-full">
          <Button className="w-full" variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Ver Detalhes
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};