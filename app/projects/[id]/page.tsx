// app/projects/[id]/page.tsx
import { ProjectDetailsPage } from "@/components/projects/ProjectDetailsPage";
import { Metadata } from "next";

interface ProjectPageProps {
    params: Promise<{
        id: string;
    }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
    // Aguarda o objeto params antes de acessar suas propriedades
    const { id } = await params;
    
    return {
        title: `Projeto | DarkStack`,
        description: "Visualize os detalhes do projeto"
    };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    // Aguarda params antes de usar suas propriedades
    const { id } = await params;
    
    return <ProjectDetailsPage projectId={id} />;
}