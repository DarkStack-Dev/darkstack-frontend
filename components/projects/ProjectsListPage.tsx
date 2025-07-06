// components/projects/ProjectsListPage.tsx - ATUALIZADA COM NOVOS COMPONENTES
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useProjects } from "@/hooks/useProjects";
import { ProjectCard } from "./ProjectCard";
import { ProjectFiltersComponent } from "./ProjectFilters";
import { ProjectLoading } from "./ProjectLoading";
import { ProjectEmpty } from "./ProjectEmpty";
import { ProjectStats } from "./ProjectStats";
import { Pagination } from "@/components/ui/pagination";
import { useAuthStore } from "@/store/authStore";

export const ProjectsListPage = () => {
  const { user } = useAuthStore();
  const { projects, loading, error, filters, updateFilters } = useProjects({
    page: 1,
    limit: 12,
    status: 'APPROVED'
  });

  const handlePageChange = (page: number) => {
    updateFilters({ page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    updateFilters({ page: 1 });
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <ProjectEmpty 
          type="no-results" 
          title="Erro ao carregar projetos"
          description={error}
          showCreateButton={false}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Projetos da Comunidade</h1>
          <p className="text-muted-foreground">
            Descubra projetos incríveis criados pela nossa comunidade
          </p>
        </div>
        
        {user && (
          <div className="flex gap-2">
            <Link href="/projects/my-projects">
              <Button variant="outline">
                Meus Projetos
              </Button>
            </Link>
            <Link href="/projects/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Projeto
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Stats */}
      {projects && (
        <ProjectStats 
          stats={{
            total: projects.pagination.total,
            approved: projects.pagination.total,
          }}
          variant="simple"
        />
      )}

      {/* Filtros */}
      <ProjectFiltersComponent
        filters={filters}
        onFiltersChange={updateFilters}
      />

      {/* Loading State */}
      {loading && <ProjectLoading count={12} />}

      {/* Projects Grid */}
      {projects && projects.projects.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                showOwner={true}
              />
            ))}
          </div>

          {/* Pagination */}
          {projects.pagination.totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                currentPage={projects.pagination.page}
                totalPages={projects.pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {projects && projects.projects.length === 0 && !loading && (
        <ProjectEmpty 
          type={filters.search ? "no-results" : "no-projects"}
          showCreateButton={!!user}
          onClearFilters={filters.search ? handleClearFilters : undefined}
        />
      )}
    </div>
  );
};