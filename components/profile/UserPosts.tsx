'use client';

import { useState, useRef } from 'react';
import { Plus, X, Image, Heart, MessageCircle, Edit3, Trash2 } from 'lucide-react';
import { formatRelativeTime } from '@/app/lib/utils';

interface Post {
  id: string;
  title: string;
  content: string;
  image?: string;
  createdAt: Date;
  likes: number;
  comments: number;
  tags?: string[];
}

const UserPosts = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      title: 'Minha primeira contribuição Open Source!',
      content: 'Estou muito feliz em anunciar que meu primeiro pull request foi aceito em um projeto open source! Foi um desafio, mas valeu a pena. Contribuir para a comunidade é incrível!',
      image: 'https://via.placeholder.com/600x300/6e00a8/FFFFFF?text=Open+Source+Contribution',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 dia atrás
      likes: 10,
      comments: 3,
      tags: ['OpenSource', 'GitHub', 'Contribuição']
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    image: '',
    tags: ''
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreatePost = () => {
    setIsCreating(true);
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setNewPost({ title: '', content: '', image: '', tags: '' });
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setNewPost(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePost = () => {
    if (!newPost.title || !newPost.content) {
      alert('Por favor, preencha o título e o conteúdo da postagem.');
      return;
    }

    const tags = newPost.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const post: Post = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      image: newPost.image || undefined,
      createdAt: new Date(),
      likes: 0,
      comments: 0,
      tags: tags.length > 0 ? tags : undefined
    };

    setPosts(prev => [post, ...prev]);
    setIsCreating(false);
    setNewPost({ title: '', content: '', image: '', tags: '' });
    setImagePreview(null);
  };

  const handleDeletePost = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta postagem?')) {
      setPosts(prev => prev.filter(post => post.id !== id));
    }
  };

  const handleLikePost = (id: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === id
          ? { ...post, likes: post.likes + 1 }
          : post
      )
    );
  };

  return (
    <section className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-text-primary border-gradient-hover pb-2">
          Minhas Postagens
        </h3>
        {!isCreating && (
          <button
            onClick={handleCreatePost}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Criar Nova Postagem
          </button>
        )}
      </div>

      {/* Create Post Form */}
      {isCreating && (
        <div className="mb-8 p-6 rounded-xl bg-background-tertiary/50 border border-border-purple/30">
          <h4 className="text-lg font-medium text-text-primary mb-4">
            Nova Postagem
          </h4>
          
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Título da Postagem:
              </label>
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                className="input"
                placeholder="Título da sua postagem"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Conteúdo:
              </label>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                className="textarea min-h-[120px]"
                placeholder="Escreva sua postagem aqui..."
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Tags (separadas por vírgula):
              </label>
              <input
                type="text"
                value={newPost.tags}
                onChange={(e) => setNewPost(prev => ({ ...prev, tags: e.target.value }))}
                className="input"
                placeholder="React, TypeScript, Frontend"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Imagem (opcional):
              </label>
              <div className="space-y-3">
                {imagePreview && (
                  <div className="relative max-w-sm">
                    <img
                      src={imagePreview}
                      alt="Pré-visualização"
                      className="w-full h-48 object-cover rounded-lg border-2 border-border-purple"
                    />
                    <button
                      onClick={() => {
                        setImagePreview(null);
                        setNewPost(prev => ({ ...prev, image: '' }));
                      }}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Image className="w-4 h-4" />
                  {imagePreview ? 'Alterar Imagem' : 'Adicionar Imagem'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSavePost}
                className="btn-primary"
              >
                Publicar Postagem
              </button>
              <button
                onClick={handleCancelCreate}
                className="btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="card group hover:shadow-purple-hover transition-all duration-300"
          >
            {/* Post Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-purple-gradient text-lg font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                  {post.title}
                </h4>
                <p className="text-text-tertiary text-sm">
                  Publicado {formatRelativeTime(post.createdAt)}
                </p>
              </div>
              
              {/* Post Actions */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="p-2 rounded-lg bg-background-tertiary hover:bg-background-quaternary transition-colors"
                  title="Editar postagem"
                >
                  <Edit3 className="w-4 h-4 text-text-secondary" />
                </button>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="p-2 rounded-lg bg-background-tertiary hover:bg-red-500/20 transition-colors"
                  title="Excluir postagem"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>

            {/* Post Content */}
            <p className="text-text-primary leading-relaxed mb-4">
              {post.content}
            </p>

            {/* Post Image */}
            {post.image && (
              <div className="mb-4 rounded-xl overflow-hidden border-2 border-border-purple">
                <img
                  src={post.image}
                  alt="Imagem da postagem"
                  className="w-full h-auto max-h-80 object-cover"
                />
              </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-purple-gradient/20 text-purple-400 rounded-full text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Post Meta */}
            <div className="flex items-center justify-between pt-4 border-t border-border-default">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLikePost(post.id)}
                  className="post-like"
                >
                  <Heart className="w-4 h-4" />
                  <span>{post.likes}</span>
                </button>
                <div className="flex items-center gap-2 text-text-secondary">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments}</span>
                </div>
              </div>
              
              <span className="text-text-tertiary text-sm">
                {post.createdAt.toLocaleDateString('pt-BR')}
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Empty State */}
      {posts.length === 0 && !isCreating && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-purple-gradient/20 flex items-center justify-center mx-auto mb-4">
            <Edit3 className="w-8 h-8 text-purple-500" />
          </div>
          <h4 className="text-lg font-medium text-text-primary mb-2">
            Nenhuma postagem ainda
          </h4>
          <p className="text-text-secondary mb-4">
            Compartilhe seus conhecimentos e experiências com a comunidade!
          </p>
          <button
            onClick={handleCreatePost}
            className="btn-primary"
          >
            Criar Primeira Postagem
          </button>
        </div>
      )}
    </section>
  );
};

export default UserPosts;