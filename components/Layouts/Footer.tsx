// components/Layouts/Footer.tsx - ATUALIZADO E TRADUZIDO
"use client"; // Necessário para usar o hook de tradução

import { Facebook, Github, Linkedin, Twitter, Copyright, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";

// 1. Importações para a internacionalização
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation"; // Usar o Link especial

export const Footer = () => {
  // 2. Chamar o hook de tradução
  const t = useTranslations('Footer');
  const currentYear = dayjs().year();

  return (
    <footer className="bg-gradient-to-br from-primary/5 to-accent/5 py-16 md:px-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* 3. Textos substituídos pelas traduções */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t('aboutTitle')}</h3>
            <Link href="/sobrenos">
              <p className="text-muted-foreground hover:text-primary transition-colors">
                {t('aboutText')}
              </p>
            </Link>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">{t('resourcesTitle')}</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/projects" className="hover:text-primary transition-colors">{t('resourcesProjects')}</Link></li>
              <li><Link href="/articles" className="hover:text-primary transition-colors">{t('resourcesArticles')}</Link></li>
              <li><Link href="/challenges" className="hover:text-primary transition-colors">{t('resourcesChallenges')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">{t('supportTitle')}</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/help" className="hover:text-primary transition-colors">{t('supportHelpCenter')}</Link></li>
              <li><Link href="/docs" className="hover:text-primary transition-colors">{t('supportDocs')}</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">{t('supportContact')}</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">{t('supportFaq')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">{t('newsletterTitle')}</h3>
            <p className="text-muted-foreground mb-4">
              {t('newsletterText')}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Copyright className="h-4 w-4" />
              <span>{currentYear} {t('copyright')}</span>
            </div>
            <div className="flex gap-4">
              {/* Links externos podem continuar como <a> */}
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};