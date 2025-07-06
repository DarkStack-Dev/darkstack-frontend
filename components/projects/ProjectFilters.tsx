// components/projects/ProjectFilters.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import { ProjectFilters } from "@/types/projects/projects";

interface ProjectFiltersProps {
  filters: Partial<ProjectFilters>;
  onFiltersChange: (filters: Partial<ProjectFilters>) => void;
  showStatusFilter?: boolean;
  showOwnerFilter?: boolean;
}

export const ProjectFiltersComponent = ({ 
  filters, 
  onFiltersChange, 
  showStatusFilter = false,
  showOwnerFilter = false 
}: ProjectFiltersProps) => {
  const [searchValue, setSearchValue] = useState(filters.search || '');

  const handleSearch = () => {
    onFiltersChange({ ...filters, search: searchValue, page: 1 });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearFilters = () => {
    setSearchValue('');
    onFiltersChange({ page: 1 });
  };

  const hasActiveFilters = filters.search || filters.status;

  return (
    <div className="space-y-4">
      {/* Barra de Busca */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar projetos..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch}>
          <Filter className="w-4 h-4 mr-2" />
          Buscar
        </Button>
      </div>

      {/* Filtros Avançados */}
      <div className="flex flex-wrap gap-3">
        {showStatusFilter && (
          <Select
            value={filters.status || "all"}
            onValueChange={(value) => 
              onFiltersChange({ 
                ...filters, 
                status: value === "all" ? undefined : value as any,
                page: 1 
              })
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="PENDING">Pendentes</SelectItem>
              <SelectItem value="APPROVED">Aprovados</SelectItem>
              <SelectItem value="REJECTED">Rejeitados</SelectItem>
              <SelectItem value="ARCHIVED">Arquivados</SelectItem>
            </SelectContent>
          </Select>
        )}

        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters} size="sm">
            <X className="w-4 h-4 mr-2" />
            Limpar Filtros
          </Button>
        )}
      </div>

      {/* Filtros Ativos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary">
              Busca: "{filters.search}"
              <button
                onClick={() => {
                  setSearchValue('');
                  onFiltersChange({ ...filters, search: undefined, page: 1 });
                }}
                className="ml-2 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.status && (
            <Badge variant="secondary">
              Status: {filters.status}
              <button
                onClick={() => onFiltersChange({ ...filters, status: undefined, page: 1 })}
                className="ml-2 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};