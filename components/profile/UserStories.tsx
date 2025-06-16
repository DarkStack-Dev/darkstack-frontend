'use client';

import { useState, useRef } from 'react';
import { Plus, X, Image } from 'lucide-react';

interface Story {
  id: string;
  image: string;
  text: string;
  createdAt: Date;
}

const UserStories = () => {
  const [stories, setStories] = useState<Story[]>([
    {
      id: '1',
      image: 'https://via.placeholder.com/150/6e00a8/FFFFFF?text=Story+1',
      text: 'Codificando até tarde!',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '2',
      image: 'https://via.placeholder.com/150/8a2be2/FFFFFF?text=Story+2',
      text: 'Novo projeto no ar!',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newStory, setNewStory] = useState({
    text: '',
    image: ''
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddStory = () => {
    setIsAdding(true);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewStory({ text: '', image: '' });
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setNewStory(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveStory = () => {
    if (!newStory.text && !newStory.image) {
      alert('Por favor, adicione texto ou uma imagem para o story.');
      return;
    }

    const story: Story = {
      id: Date.now().toString(),
      text: newStory.text,
      image: newStory.image || 'https://via.placeholder.com/150/6e00a8/FFFFFF?text=New+Story',
      createdAt: new Date()
    };

    setStories(prev => [story, ...prev]);
    setIsAdding(false);
    setNewStory({ text: '', image: '' });
    setImagePreview(null);
  };

  const handleRemoveStory = (id: string) => {
    setStories(prev => prev.filter(story => story.id !== id));
  };

  return (
    <section className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-text-primary border-gradient-hover pb-2">
          Meus Stories
        </h3>
        {!isAdding && (
          <button
            onClick={handleAddStory}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Adicionar Story
          </button>
        )}
      </div>

      {/* Stories Grid */}
      {!isAdding && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
          {stories.map((story) => (
            <div
              key={story.id}
              className="group relative bg-background-tertiary rounded-xl p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-purple"
            >
              {/* Remove button */}
              <button
                onClick={() => handleRemoveStory(story.id)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
                aria-label="Remover story"
              >
                <X className="w-3 h-3 text-white" />
              </button>

              {/* Story Image */}
              <div className="aspect-square rounded-lg overflow-hidden mb-3 border-2 border-purple-gradient/30">
                <img
                  src={story.image}
                  alt="Story"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Story Text */}
              <p className="text-sm text-text-secondary text-center line-clamp-2">
                {story.text}
              </p>

              {/* Timestamp */}
              <div className="text-xs text-text-tertiary text-center mt-2">
                {story.createdAt.toLocaleDateString('pt-BR')}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Story Form */}
      {isAdding && (
        <div className="max-w-md mx-auto">
          <div className="space-y-4">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Imagem do Story:
              </label>
              <div className="flex flex-col items-center gap-4">
                {imagePreview && (
                  <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-purple-gradient/30">
                    <img
                      src={imagePreview}
                      alt="Pré-visualização"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Image className="w-4 h-4" />
                  {imagePreview ? 'Alterar Imagem' : 'Escolher Imagem'}
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

            {/* Story Text */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Texto do Story:
              </label>
              <textarea
                value={newStory.text}
                onChange={(e) => setNewStory(prev => ({ ...prev, text: e.target.value }))}
                className="textarea"
                placeholder="O que você está fazendo?"
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleSaveStory}
                className="btn-primary"
              >
                Publicar Story
              </button>
              <button
                onClick={handleCancelAdd}
                className="btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {stories.length === 0 && !isAdding && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-purple-gradient/20 flex items-center justify-center mx-auto mb-4">
            <Image className="w-8 h-8 text-purple-500" />
          </div>
          <h4 className="text-lg font-medium text-text-primary mb-2">
            Nenhum story ainda
          </h4>
          <p className="text-text-secondary mb-4">
            Compartilhe momentos do seu dia a dia como desenvolvedor!
          </p>
          <button
            onClick={handleAddStory}
            className="btn-primary"
          >
            Criar Primeiro Story
          </button>
        </div>
      )}

      {/* Stories Tips */}
      {stories.length > 0 && !isAdding && (
        <div className="mt-6 p-4 rounded-lg bg-blue-gradient/10 border border-blue-500/20">
          <div className="flex items-start gap-3">
            <span className="text-lg">📱</span>
            <div>
              <h5 className="text-text-primary font-medium mb-1">
                Sobre os Stories
              </h5>
              <p className="text-text-secondary text-sm leading-relaxed">
                Use stories para compartilhar momentos rápidos do seu dia como desenvolvedor: 
                workspace, projetos em andamento, aprendizados, ou conquistas!
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default UserStories;