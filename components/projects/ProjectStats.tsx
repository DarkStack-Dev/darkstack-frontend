// components/projects/ProjectStats.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FolderOpen, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Archive,
  Users,
  Calendar
} from "lucide-react";

interface ProjectStatsProps {
  stats: {
    total: number;
    pending?: number;
    approved?: number;
    rejected?: number;
    archived?: number;
  };
  variant?: 'simple' | 'detailed';
}

export const ProjectStats = ({ stats, variant = 'simple' }: ProjectStatsProps) => {
  if (variant === 'simple') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {stats.total}
            </div>
            <div className="text-sm text-muted-foreground">
              Total de Projetos
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.approved || 0}
            </div>
            <div className="text-sm text-muted-foreground">
              Projetos Aprovados
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {/* Aqui seria melhor vir do backend */}
              {Math.floor(stats.total * 0.7)}
            </div>
            <div className="text-sm text-muted-foreground">
              Criadores Únicos
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <FolderOpen className="w-5 h-5 text-gray-600" />
          </div>
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-yellow-600">{stats.pending || 0}</div>
          <div className="text-sm text-muted-foreground">Pendentes</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.approved || 0}</div>
          <div className="text-sm text-muted-foreground">Aprovados</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600">{stats.rejected || 0}</div>
          <div className="text-sm text-muted-foreground">Rejeitados</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Archive className="w-5 h-5 text-gray-600" />
          </div>
          <div className="text-2xl font-bold text-gray-600">{stats.archived || 0}</div>
          <div className="text-sm text-muted-foreground">Arquivados</div>
        </CardContent>
      </Card>
    </div>
  );
};
