// components/projects/ModerationPage.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, XCircle, Clock, Trash2, RotateCcw } from "lucide-react";
import { useProjects, useProjectModeration, useDeletedProjects } from "@/hooks/useProjects";
import { ProjectCard } from "./ProjectCard";
import { ProjectFiltersComponent } from "./ProjectFilters";
import { toast } from "sonner";

export const ModerationPage = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionProjectId, setRejectionProjectId] = useState<string | null>(null);
  
  // Hooks para diferentes tipos de projetos
  const { projects: pendingProjects, loading: loadingPending, refresh: refreshPending } = useProjects({
    status: 'PENDING',
    limit: 20
  });
  
  const { projects: allProjects, loading: loadingAll, filters, updateFilters } = useProjects({
    limit: 20
  });

  const { deletedProjects, loading: loadingDeleted, refresh: refreshDeleted } = useDeletedProjects();
  
  const { approve, reject, remove, restore, loading: moderationLoading } = useProjectModeration();

  const handleApprove = async (id: string) => {
    const result = await approve(id);
    if (result.success) {
      refreshPending();
      if (activeTab === "all") refreshAll();
    }
  };

  const handleReject = async () => {
    if (!rejectionProjectId || !rejectionReason.trim()) {
      toast.error("Motivo da rejeição é obrigatório");
      return;
    }

    const result = await reject(rejectionProjectId, rejectionReason);
    if (result.success) {
      setRejectionProjectId(null);
      setRejectionReason("");
      refreshPending();
      if (activeTab === "all") refreshAll();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este projeto?")) return;
    
    const result = await remove(id);
    if (result.success) {
      refreshPending();
      if (activeTab === "all") refreshAll();
      if (activeTab === "deleted") refreshDeleted();
    }
  };

  const handleRestore = async (id: string) => {
    const result = await restore(id);
    if (result.success) {
      refreshDeleted();
    }
  };

  const refreshAll = () => {
    // Como o hook useProjects não tem um refresh direto, recarregamos a página ou usamos updateFilters
    updateFilters({ ...filters });
  };

  const renderProjectsList = (projects: any[], loading: boolean, showActions = true) => {
    if (loading) {
      return (
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
      );
    }

    if (!projects?.length) {
      return (
        <Card className="text-center py-12">
          <CardContent>
            <Clock className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum projeto encontrado</h3>
            <p className="text-muted-foreground">
              {activeTab === "pending" ? "Não há projetos aguardando moderação" : "Nenhum projeto corresponde aos filtros"}
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            showOwner={true}
            showActions={showActions}
            onApprove={handleApprove}
            onReject={(id) => setRejectionProjectId(id)}
            onDelete={handleDelete}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Painel de Moderação</h1>
        <p className="text-muted-foreground">
          Gerencie e modere projetos da comunidade
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {pendingProjects?.pagination.total || 0}
            </div>
            <div className="text-sm text-muted-foreground">Aguardando Moderação</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {allProjects?.projects.filter(p => p.status === 'APPROVED').length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Aprovados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {allProjects?.projects.filter(p => p.status === 'REJECTED').length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Rejeitados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {deletedProjects?.pagination.total || 0}
            </div>
            <div className="text-sm text-muted-foreground">Deletados</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pendentes
            {pendingProjects?.pagination.total && (
              <Badge variant="secondary" className="ml-2">
                {pendingProjects.pagination.total}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="all">Todos os Projetos</TabsTrigger>
          <TabsTrigger value="deleted">
            Deletados
            {deletedProjects?.pagination.total && deletedProjects.pagination.total > 0 && (
              <Badge variant="secondary" className="ml-2">
                {deletedProjects.pagination.total}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Projetos Pendentes */}
        <TabsContent value="pending" className="space-y-6">
          {renderProjectsList(pendingProjects?.projects || [], loadingPending)}
        </TabsContent>

        {/* Todos os Projetos */}
        <TabsContent value="all" className="space-y-6">
          <ProjectFiltersComponent
            filters={filters}
            onFiltersChange={updateFilters}
            showStatusFilter={true}
          />
          {renderProjectsList(allProjects?.projects || [], loadingAll)}
        </TabsContent>

        {/* Projetos Deletados */}
        <TabsContent value="deleted" className="space-y-6">
          {loadingDeleted ? (
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
          ) : deletedProjects?.projects.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deletedProjects.projects.map((project) => (
                <Card key={project.id} className="opacity-75">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold line-clamp-1">{project.name}</h3>
                      <Badge variant="outline">Deletado</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {project.description}
                    </p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground mb-3">
                      <span>Por: {project.owner.name}</span>
                      <span>Deletado: {new Date(project.deletedAt!).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRestore(project.id)}
                        disabled={moderationLoading}
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Restaurar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(project.id)}
                        disabled={moderationLoading}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Deletar Permanente
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Trash2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum projeto deletado</h3>
                <p className="text-muted-foreground">Não há projetos na lixeira</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog de Rejeição */}
      <Dialog open={!!rejectionProjectId} onOpenChange={() => setRejectionProjectId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar Projeto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Motivo da rejeição *</label>
              <Textarea
                placeholder="Explique o motivo da rejeição..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setRejectionProjectId(null)}>
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleReject}
                disabled={!rejectionReason.trim() || moderationLoading}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Rejeitar Projeto
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};