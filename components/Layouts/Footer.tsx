import { Facebook, Github, Linkedin, Twitter, Copyright, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import Link from "next/link";

export const Footer = () => {
  const currentYear = dayjs().year();
  return (
    <footer className="bg-gradient-to-br from-primary/5 to-accent/5 py-16 md:px-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-bold text-lg mb-4">Sobre Nós</h3>
            <Link href="/sobrenos">
              <p className="text-muted-foreground">
                Comunidade que vai revolucionar tudo que há de desenvolvimento em programação. A comunidade de progamadores feita para programadores.
              </p>
            </Link>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Recursos</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>Projetos</li>
              {/* <li>Monitoramento em Tempo Real</li> */}
              <li>Artigos</li>
              <li>Desafios</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Suporte</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>Central de Ajuda</li>
              <li>Documentação</li>
              <li>Contato</li>
              <li>FAQ</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Newsletter</h3>
            <p className="text-muted-foreground mb-4">
              Receba as últimas atualizações sobre nossa tecnologia.
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
              <span>{currentYear} DARKSTACK. Todos os direitos reservados.</span>
            </div>
            <div className="flex gap-4">
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