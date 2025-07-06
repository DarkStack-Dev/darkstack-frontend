// app/moderator/projects/page.tsx
import { ModerationPage } from "@/components/projects/ModerationPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Moderação de Projetos | DarkStack",
    description: "Painel de moderação para gerenciar projetos da comunidade"
};

export default function ModerationProjectsPage() {
    return <ModerationPage />;
}