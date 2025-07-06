// components/projects/MyProjectsPage.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, FolderOpen, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useMyProjects } from "@/hooks/useProjects";
import { ProjectCard } from "./ProjectCard";
import { ProjectFiltersComponent } from "./ProjectFilters";
import { ProjectStatus } from "@/types/projects/projects";

export const MyProjectsPage = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const { myProjects, loading, error, filters, updateFilters } = useMyProjects({
    page: 1,
    limit: 12
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const status = value === "all" ? undefined : value as ProjectStatus;
    updateFilters({ status, page: 1 });
  };

  const handleFiltersChange = (newFilters: any) => {
    updateFilters({ ...newFilters, status: activeTab === "all" ? undefined : activeTab as ProjectStatus });
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Card className="text-center py-12">
          <CardContent>
            <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Erro ao carregar projetos</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Meus Projetos</h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe seus projetos
          </p>
        </div>
        
        <Link href="/projects/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Projeto
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      {myProjects?.stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{myProjects.stats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{myProjects.stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pendentes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{myProjects.stats.approved}</div>
              <div className="text-sm text-muted-foreground">Aprovados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{myProjects.stats.rejected}</div>
              <div className="text-sm text-muted-foreground">Rejeitados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">{myProjects.stats.archived}</div>
              <div className="text-sm text-muted-foreground">Arquivados</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs por Status */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            Todos
            {myProjects?.stats && (
              <Badge variant="secondary" className="ml-2">
                {myProjects.stats.total}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="PENDING">
            Pendentes
            {myProjects?.stats && myProjects.stats.pending > 0 && (
              <Badge variant="secondary" className="ml-2">
                {myProjects.stats.pending}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="APPROVED">
            Aprovados
            {myProjects?.stats && myProjects.stats.approved > 0 && (
              <Badge variant="secondary" className="ml-2">
                {myProjects.stats.approved}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="REJECTED">
            Rejeitados
            {myProjects?.stats && myProjects.stats.rejected > 0 && (
              <Badge variant="secondary" className="ml-2">
                {myProjects.stats.rejected}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="ARCHIVED">
            Arquivados
            {myProjects?.stats && myProjects.stats.archived > 0 && (
              <Badge variant="secondary" className="ml-2">
                {myProjects.stats.archived}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {/* Filtros */}
          <ProjectFiltersComponent
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-6 mb-2" />
                    <Skeleton className="h-4 mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Projects Grid */}
          {myProjects && myProjects.projects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProjects.projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  showOwner={false}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {myProjects && myProjects.projects.length === 0 && !loading && (
            <Card className="text-center py-12">
              <CardContent>
                <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {activeTab === "all" ? "Nenhum projeto encontrado" : `Nenhum projeto ${activeTab.toLowerCase()}`}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {activeTab === "all" 
                    ? "Comece criando seu primeiro projeto!"
                    : filters.search 
                      ? "Tente ajustar os filtros de busca"
                      : `Você não tem projetos com status ${activeTab.toLowerCase()}`
                  }
                </p>
                {activeTab === "all" && (
                  <Link href="/projects/create">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Primeiro Projeto
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
