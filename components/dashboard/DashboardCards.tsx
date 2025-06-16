'use client';

import Link from 'next/link';
import { BookOpen, MessageCircle, GraduationCap, Flame } from 'lucide-react';

const DashboardCards = () => {
  const cards = [
    {
      id: 'books',
      title: 'Livros da Comunidade',
      description: 'Descubra os livros mais recomendados pela comunidade de desenvolvedores',
      icon: '📚',
      lucideIcon: BookOpen,
      href: '/books',
      gradient: 'from-blue-500/20 to-purple-500/20',
      count: '247 livros'
    },
    {
      id: 'forums',
      title: 'Fóruns Abertos',
      description: 'Participe das discussões mais quentes do momento e compartilhe conhecimento',
      icon: '💬',
      lucideIcon: MessageCircle,
      href: '/forums',
      gradient: 'from-green-500/20 to-emerald-500/20',
      count: '89 discussões ativas'
    },
    {
      id: 'courses',
      title: 'Cursos Recomendados',
      description: 'Aprimore suas habilidades com cursos selecionados pela comunidade',
      icon: '🎓',
      lucideIcon: GraduationCap,
      href: '/courses',
      gradient: 'from-orange-500/20 to-red-500/20',
      count: '156 cursos'
    },
    {
      id: 'trends',
      title: 'Novidades',
      description: 'Fique por dentro das últimas tendências e tecnologias em desenvolvimento',
      icon: '🔥',
      lucideIcon: Flame,
      href: '/trends',
      gradient: 'from-pink-500/20 to-purple-500/20',
      count: '42 novidades hoje'
    }
  ];

  const handleCardClick = (cardId: string) => {
    // Feedback visual
    const card = document.getElementById(`card-${cardId}`);
    if (card) {
      card.style.transform = 'scale(0.98)';
      setTimeout(() => {
        card.style.transform = '';
      }, 150);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, href: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.location.href = href;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const LucideIcon = card.lucideIcon;
        
        return (
          <Link
            key={card.id}
            href={card.href}
            id={`card-${card.id}`}
            className="group"
            onClick={() => handleCardClick(card.id)}
            onKeyDown={(e) => handleKeyDown(e, card.href)}
            tabIndex={0}
            role="button"
            aria-label={`Acessar ${card.title}`}
          >
            <div
              className={`card card-hover-accent h-full bg-gradient-to-br ${card.gradient} group-hover:scale-105 transition-all duration-300 animate-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon Section */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-purple-gradient/20 flex items-center justify-center text-2xl">
                    {card.icon}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-gradient rounded-full flex items-center justify-center">
                    <LucideIcon className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-text-primary group-hover:text-purple-gradient transition-colors duration-300">
                    {card.title}
                  </h3>
                  <p className="text-xs text-text-tertiary mt-1">
                    {card.count}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-text-secondary text-sm leading-relaxed mb-4 group-hover:text-text-primary transition-colors duration-300">
                {card.description}
              </p>

              {/* Action Arrow */}
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-purple-gradient/10 flex items-center justify-center group-hover:bg-purple-gradient/20 transition-colors duration-300">
                  <svg
                    className="w-4 h-4 text-purple-500 group-hover:text-purple-400 transition-colors duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                
                {/* Hover indicator */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-1 text-xs text-purple-500">
                    <span>Explorar</span>
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default DashboardCards;