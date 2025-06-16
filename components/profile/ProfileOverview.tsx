'use client';

import { useState, useRef } from 'react';
import { Camera, Edit3, Save, X } from 'lucide-react';
import { getInitials } from '@/app/lib/utils';

interface ProfileData {
  name: string;
  username: string;
  bio: string;
  location: string;
  avatar?: string;
}

const ProfileOverview = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'Nome Usuario',
    username: 'nome.usuario',
    bio: 'Desenvolvedor apaixonado por tecnologia e inovação. Foco em desenvolvimento web e mobile.',
    location: 'São Paulo, Brasil',
  });
  const [editingData, setEditingData] = useState<ProfileData>(profileData);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = () => {
    setEditingData(profileData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditingData(profileData);
    setAvatarPreview(null);
    setIsEditing(false);
  };

  const handleSave = () => {
    setProfileData(editingData);
    if (avatarPreview) {
      setProfileData(prev => ({ ...prev, avatar: avatarPreview }));
    }
    setAvatarPreview(null);
    setIsEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setEditingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const displayAvatar = avatarPreview || profileData.avatar;

  return (
    <section className="card">
      <div className="flex flex-col items-center text-center">
        {/* Avatar Section */}
        <div className="relative mb-6">
          <div className="avatar-glow w-30 h-30 rounded-full bg-purple-gradient p-1">
            <div className="w-full h-full rounded-full bg-background-quaternary flex items-center justify-center overflow-hidden">
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt="Avatar do usuário"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-text-secondary font-bold text-2xl">
                  {getInitials(profileData.name)}
                </span>
              )}
            </div>
          </div>
          
          {isEditing && (
            <>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 w-9 h-9 bg-purple-gradient rounded-full flex items-center justify-center text-white shadow-purple hover:shadow-purple-hover transition-all duration-300 hover:scale-110"
                title="Alterar foto de perfil"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </>
          )}
        </div>

        {/* Profile Info */}
        {!isEditing ? (
          <div className="mb-6">
            <h3 className="text-purple-gradient text-2xl font-bold mb-2">
              @{profileData.username}
            </h3>
            <p className="text-text-primary text-lg mb-2 max-w-md">
              {profileData.bio}
            </p>
            <p className="text-text-secondary flex items-center justify-center gap-1">
              <span>📍</span>
              {profileData.location}
            </p>
          </div>
        ) : (
          <div className="w-full max-w-2xl mb-6 text-left">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Nome de Usuário:
                </label>
                <input
                  type="text"
                  value={editingData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="input"
                  placeholder="nome.usuario"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Bio:
                </label>
                <textarea
                  value={editingData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="textarea"
                  placeholder="Conte um pouco sobre você..."
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Localização:
                </label>
                <input
                  type="text"
                  value={editingData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="input"
                  placeholder="Sua cidade, Estado"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="btn-primary flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Editar Perfil
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="btn-primary flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Salvar Alterações
              </button>
              <button
                onClick={handleCancel}
                className="btn-secondary flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
            </>
          )}
        </div>

        {/* Profile Stats */}
        <div className="w-full mt-8 pt-6 border-t border-border-default">
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-gradient mb-1">
                42
              </div>
              <div className="text-sm text-text-secondary">
                Postagens
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-gradient mb-1">
                1.2k
              </div>
              <div className="text-sm text-text-secondary">
                Seguidores
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-gradient mb-1">
                89
              </div>
              <div className="text-sm text-text-secondary">
                Seguindo
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileOverview;