'use client';

import { useState } from 'react';
import { Plus, Github, Linkedin, Instagram, Twitter, Globe, X } from 'lucide-react';
import { isValidUrl } from '@/app/lib/utils';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: React.ComponentType<any>;
}

const SocialMedia = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    {
      id: '1',
      platform: 'github',
      url: 'https://github.com/',
      icon: Github
    },
    {
      id: '2',
      platform: 'linkedin',
      url: 'https://linkedin.com/in/',
      icon: Linkedin
    },
    {
      id: '3',
      platform: 'instagram',
      url: 'https://instagram.com/',
      icon: Instagram
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newLink, setNewLink] = useState({
    platform: 'github',
    url: ''
  });

  const platformOptions = [
    { value: 'github', label: 'GitHub', icon: Github },
    { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { value: 'instagram', label: 'Instagram', icon: Instagram },
    { value: 'twitter', label: 'Twitter', icon: Twitter },
    { value: 'website', label: 'Website', icon: Globe },
  ];

  const handleAddSocial = () => {
    setIsAdding(true);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewLink({ platform: 'github', url: '' });
  };

  const handleSaveAdd = () => {
    if (!newLink.url || !isValidUrl(newLink.url)) {
      alert('Por favor, insira um link válido.');
      return;
    }

    const platformOption = platformOptions.find(p => p.value === newLink.platform);
    if (!platformOption) return;

    const newSocialLink: SocialLink = {
      id: Date.now().toString(),
      platform: newLink.platform,
      url: newLink.url,
      icon: platformOption.icon
    };

    setSocialLinks(prev => [...prev, newSocialLink]);
    setIsAdding(false);
    setNewLink({ platform: 'github', url: '' });
  };

  const handleRemoveSocial = (id: string) => {
    setSocialLinks(prev => prev.filter(link => link.id !== id));
  };

  const getSocialIconClass = (platform: string) => {
    const baseClass = "social-icon";
    return `${baseClass} ${platform}`;
  };

  return (
    <section className="card">
      <h3 className="text-xl font-semibold text-text-primary mb-6 border-gradient-hover pb-2">
        Minhas Redes Sociais
      </h3>

      {/* Social Links Grid */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        {socialLinks.map((link) => {
          const IconComponent = link.icon;
          return (
            <div key={link.id} className="relative group">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={getSocialIconClass(link.platform)}
                aria-label={link.platform}
              >
                <IconComponent className="w-5 h-5" />
              </a>
              
              {/* Remove button - aparece no hover */}
              <button
                onClick={() => handleRemoveSocial(link.id)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                aria-label={`Remover ${link.platform}`}
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Social Button */}
      {!isAdding ? (
        <div className="text-center">
          <button
            onClick={handleAddSocial}
            className="btn-secondary flex items-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            Adicionar Rede Social
          </button>
        </div>
      ) : (
        /* Add Social Form */
        <div className="max-w-md mx-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Plataforma:
              </label>
              <select
                value={newLink.platform}
                onChange={(e) => setNewLink(prev => ({ ...prev, platform: e.target.value }))}
                className="input"
              >
                {platformOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Link:
              </label>
              <input
                type="url"
                value={newLink.url}
                onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                className="input"
                placeholder="https://..."
              />
            </div>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleSaveAdd}
                className="btn-primary"
              >
                Adicionar
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

      {/* Professional Networks Section */}
      <div className="mt-8 pt-6 border-t border-border-default">
        <h4 className="text-lg font-medium text-text-primary mb-4 text-center">
          Redes Profissionais
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-background-tertiary/50">
            <Github className="w-5 h-5 text-text-secondary" />
            <div>
              <div className="text-text-primary font-medium">GitHub</div>
              <div className="text-text-tertiary">42 repositórios</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-background-tertiary/50">
            <Linkedin className="w-5 h-5 text-text-secondary" />
            <div>
              <div className="text-text-primary font-medium">LinkedIn</div>
              <div className="text-text-tertiary">500+ conexões</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-6 p-4 rounded-lg bg-purple-gradient/10 border border-purple-gradient/20">
        <div className="flex items-start gap-3">
          <span className="text-lg">💡</span>
          <div>
            <h5 className="text-text-primary font-medium mb-1">
              Dica Profissional
            </h5>
            <p className="text-text-secondary text-sm leading-relaxed">
              Mantenha seus perfis profissionais atualizados e consistentes com sua marca pessoal. 
              Isso ajuda recrutadores e outros desenvolvedores a te encontrarem mais facilmente.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialMedia;