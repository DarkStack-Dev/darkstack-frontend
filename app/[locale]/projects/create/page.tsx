// app/projects/create/page.tsx
import { ProjectForm } from "@/components/projects/ProjectForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Criar Projeto | DarkStack",
    description: "Compartilhe seu projeto com a comunidade"
};

export default function CreateProjectPage() {
    return <ProjectForm />;
}
