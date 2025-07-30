// app/projects/page.tsx - SUBSTITUIR A ATUAL
import { ProjectsMainPage } from "@/components/projects/ProjectsMainPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Projetos da Comunidade | DarkStack",
    description: "Descubra projetos incríveis criados pela nossa comunidade de desenvolvedores"
};

export default function ProjectsPage() {
    return <ProjectsMainPage />;
}
