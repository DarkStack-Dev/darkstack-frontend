'use client';

import { useState } from 'react';
import { Plus, ExternalLink, Github, Globe, X, Edit3, Trash2, Code, Star } from 'lucide-react';
import { isValidUrl } from '@/app/lib/utils';

interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
  githubLink?: string;
  technologies: string[];
  status: 'completed' | 'in_progress' | 'archived';
  featured: boolean;
  createdAt: Date;
}

interface NewProject {
  name: string;
  description: string;
  link: string;
  githubLink: string;
  technologies: string;
  status: 'completed' | 'in_progress' | 'archived';
  featured: boolean;
}

const UserProjects = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'DevConnect - Plataforma de Mentoria',
      description: 'Plataforma web para conectar desenvolvedores juniores com mentores experientes.',
      link: 'https://devconnect.exemplo.com',
      githubLink: 'https://github.com/usuario/devconnect',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
      status: 'completed',
      featured: true,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 dias atrás
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newProject, setNewProject] = useState<NewProject>({
    name: '',
    description: '',
    link: '',
    githubLink: '',
    technologies: '',
    status: 'in_progress',
    featured: false
  });

  const statusOptions = [
    { value: 'in_progress', label: 'Em Desenvolvimento', color: 'text-yellow-500', bg: 'bg-yellow-500/20' },
    { value: 'completed', label: 'Concluído', color: 'text-green-500', bg: 'bg-green-500/20' },
    { value: 'archived', label: 'Arquivado', color: 'text-gray-500', bg: 'bg-gray-500/20' }
  ];

  const handleAddProject = () => {
    setIsAdding(true);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewProject({
      name: '',
      description: '',
      link: '',
      githubLink: '',
      technologies: '',
      status: 'in_progress',
      featured: false
    });
  };

  const handleSaveProject = () => {
    if (!newProject.name || !newProject.description || !newProject.link) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!isValidUrl(newProject.link)) {
      alert('Por favor, insira um link válido para o projeto.');
      return;
    }

    if (newProject.githubLink && !isValidUrl(newProject.githubLink)) {
      alert('Por favor, insira um link válido para o GitHub.');
      return;
    }

    const technologies = newProject.technologies
      .split(',')
      .map(tech => tech.trim())
      .filter(tech => tech.length > 0);

    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      link: newProject.link,
      githubLink: newProject.githubLink || undefined,
      technologies,
      status: newProject.status,
      featured: newProject.featured,
      createdAt: new Date()
    };

    setProjects(prev => [project, ...prev]);
    handleCancelAdd();
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
      setProjects(prev => prev.filter(project => project.id !== id));
    }
  };

  const handleToggleFeatured = (id: string) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === id
          ? { ...project, featured: !project.featured }
          : project
      )
    );
  };

  const getStatusInfo = (status: Project['status']) => {
    return statusOptions.find(option => option.value === status) || statusOptions[0];
  };

  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  return (
    <section className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-text-primary border-gradient-hover pb-2">
          Meus Projetos
        </h3>
        {!isAdding && (
          <button
            onClick={handleAddProject}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar Novo Projeto
          </button>
        )}
      </div>

      {/* Add Project Form */}
      {isAdding && (
        <div className="mb-8 p-6 rounded-xl bg-background-tertiary/50 border border-border-purple/30">
          <h4 className="text-lg font-medium text-text-primary mb-4">
            Novo Projeto
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Nome do Projeto: *
              </label>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                className="input"
                placeholder="Nome do seu projeto"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Descrição: *
              </label>
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                className="textarea"
                placeholder="Breve descrição do projeto..."
                rows={3}
              />
            </div>

            {/* Links */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Link do Projeto: *
              </label>
              <input
                type="url"
                value={newProject.link}
                onChange={(e) => setNewProject(prev => ({ ...prev, link: e.target.value }))}
                className="input"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Link do GitHub:
              </label>
              <input
                type="url"
                value={newProject.githubLink}
                onChange={(e) => setNewProject(prev => ({ ...prev, githubLink: e.target.value }))}
                className="input"
                placeholder="https://github.com/..."
              />
            </div>

            {/* Technologies */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Tecnologias (separadas por vírgula):
              </label>
              <input
                type="text"
                value={newProject.technologies}
                onChange={(e) => setNewProject(prev => ({ ...prev, technologies: e.target.value }))}
                className="input"
                placeholder="React, Node.js, PostgreSQL"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Status:
              </label>
              <select
                value={newProject.status}
                onChange={(e) => setNewProject(prev => ({ 
                  ...prev, 
                  status: e.target.value as 'completed' | 'in_progress' | 'archived'
                }))}
                className="input"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Featured */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
                <input
                  type="checkbox"
                  checked={newProject.featured}
                  onChange={(e) => setNewProject(prev => ({ ...prev, featured: e.target.checked }))}
                  className="w-4 h-4 text-primary-500 bg-background-quaternary border-border-default rounded focus:ring-primary-500"
                />
                Destacar como projeto principal
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6">
            <button
              onClick={handleSaveProject}
              className="btn-primary"
            >
              Salvar Projeto
            </button>
            <button
              onClick={handleCancelAdd}
              className="btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-500" />
            <h4 className="text-lg font-medium text-text-primary">
              Projetos em Destaque
            </h4>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={handleDeleteProject}
                onToggleFeatured={handleToggleFeatured}
                getStatusInfo={getStatusInfo}
              />
            ))}
          </div>
        </div>
      )}

      {/* Other Projects */}
      {otherProjects.length > 0 && (
        <div>
          <h4 className="text-lg font-medium text-text-primary mb-4">
            Outros Projetos
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {otherProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={handleDeleteProject}
                onToggleFeatured={handleToggleFeatured}
                getStatusInfo={getStatusInfo}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {projects.length === 0 && !isAdding && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-purple-gradient/20 flex items-center justify-center mx-auto mb-4">
            <Code className="w-8 h-8 text-purple-500" />
          </div>
          <h4 className="text-lg font-medium text-text-primary mb-2">
            Nenhum projeto ainda
          </h4>
          <p className="text-text-secondary mb-4">
            Mostre seus projetos e conquistas para a comunidade!
          </p>
          <button
            onClick={handleAddProject}
            className="btn-primary"
          >
            Adicionar Primeiro Projeto
          </button>
        </div>
      )}
    </section>
  );
};

// Project Card Component
interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  getStatusInfo: (status: Project['status']) => { value: string; label: string; color: string; bg: string; };
}

const ProjectCard = ({ project, onDelete, onToggleFeatured, getStatusInfo }: ProjectCardProps) => {
  const statusInfo = getStatusInfo(project.status);

  return (
    <div className="group bg-background-tertiary/50 rounded-xl p-4 border border-border-default hover:border-purple-gradient/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-purple">
      {/* Project Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-text-primary font-semibold text-lg group-hover:text-purple-gradient transition-colors">
              {project.name}
            </h4>
            {project.featured && (
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
            )}
          </div>
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
            {statusInfo.label}
          </div>
        </div>
        
        {/* Project Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onToggleFeatured(project.id)}
            className={`p-2 rounded-lg transition-colors ${
              project.featured ? 'bg-yellow-500/20 text-yellow-500' : 'bg-background-tertiary hover:bg-background-quaternary'
            }`}
            title={project.featured ? 'Remover destaque' : 'Destacar projeto'}
          >
            <Star className={`w-4 h-4 ${project.featured ? 'fill-current' : ''}`} />
          </button>
          <button
            className="p-2 rounded-lg bg-background-tertiary hover:bg-background-quaternary transition-colors"
            title="Editar projeto"
          >
            <Edit3 className="w-4 h-4 text-text-secondary" />
          </button>
          <button
            onClick={() => onDelete(project.id)}
            className="p-2 rounded-lg bg-background-tertiary hover:bg-red-500/20 transition-colors"
            title="Excluir projeto"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </div>

      {/* Project Description */}
      <p className="text-text-secondary text-sm leading-relaxed mb-4">
        {project.description}
      </p>

      {/* Technologies */}
      {project.technologies.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 bg-purple-gradient/20 text-purple-400 rounded text-xs font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {/* Project Links */}
      <div className="flex items-center gap-3">
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 bg-purple-gradient rounded-lg text-white text-sm font-medium hover:shadow-purple-hover transition-all duration-300 hover:scale-105"
        >
          <ExternalLink className="w-4 h-4" />
          Ver Projeto
        </a>
        
        {project.githubLink && (
          <a
            href={project.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 bg-background-quaternary border border-border-default rounded-lg text-text-secondary text-sm font-medium hover:text-text-primary hover:border-purple-gradient/50 transition-all duration-300"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
        )}
      </div>
    </div>
  );
};

export default UserProjects;