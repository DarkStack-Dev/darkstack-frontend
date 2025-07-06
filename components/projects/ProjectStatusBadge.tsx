// components/projects/ProjectStatusBadge.tsx
import { Badge } from "@/components/ui/badge";
import { ProjectStatus } from "@/types/projects/projects";
import { Clock, CheckCircle, XCircle, Archive } from "lucide-react";

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  size?: "sm" | "default";
}

export const ProjectStatusBadge = ({ status, size = "default" }: ProjectStatusBadgeProps) => {
  const getStatusConfig = (status: ProjectStatus) => {
    switch (status) {
      case 'PENDING':
        return {
          variant: 'secondary' as const,
          icon: Clock,
          label: 'Aguardando',
          className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        };
      case 'APPROVED':
        return {
          variant: 'default' as const,
          icon: CheckCircle,
          label: 'Aprovado',
          className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        };
      case 'REJECTED':
        return {
          variant: 'destructive' as const,
          icon: XCircle,
          label: 'Rejeitado',
          className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        };
      case 'ARCHIVED':
        return {
          variant: 'outline' as const,
          icon: Archive,
          label: 'Arquivado',
          className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge 
      variant={config.variant} 
      className={`${config.className} ${size === 'sm' ? 'text-xs px-2 py-1' : ''}`}
    >
      <Icon className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} mr-1`} />
      {config.label}
    </Badge>
  );
};
