// components/projects/ProjectEmpty.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen, Plus, Search } from "lucide-react";
import Link from "next/link";

interface ProjectEmptyProps {
  type: 'no-projects' | 'no-results' | 'no-pending' | 'no-approved';
  title?: string;
  description?: string;
  showCreateButton?: boolean;
  onClearFilters?: () => void;
}

export const ProjectEmpty = ({ 
  type, 
  title, 
  description, 
  showCreateButton = true,
  onClearFilters 
}: ProjectEmptyProps) => {
  const getConfig = () => {
    switch (type) {
      case 'no-projects':
        return {
          icon: FolderOpen,
          title: title || 'Nenhum projeto encontrado',
          description: description || 'Comece criando seu primeiro projeto!',
          showCreate: showCreateButton
        };
      case 'no-results':
        return {
          icon: Search,
          title: title || 'Nenhum resultado encontrado',
          description: description || 'Tente ajustar os filtros de busca',
          showCreate: false
        };
      case 'no-pending':
        return {
          icon: FolderOpen,
          title: title || 'Nenhum projeto pendente',
          description: description || 'Não há projetos aguardando moderação',
          showCreate: false
        };
      case 'no-approved':
        return {
          icon: FolderOpen,
          title: title || 'Nenhum projeto aprovado',
          description: description || 'Ainda não há projetos aprovados',
          showCreate: false
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <Card className="text-center py-12">
      <CardContent>
        <Icon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">{config.title}</h3>
        <p className="text-muted-foreground mb-4">{config.description}</p>
        
        <div className="flex gap-2 justify-center">
          {config.showCreate && (
            <Link href="/projects/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Criar Projeto
              </Button>
            </Link>
          )}
          
          {type === 'no-results' && onClearFilters && (
            <Button variant="outline" onClick={onClearFilters}>
              Limpar Filtros
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};