// app/projects/[id]/page.tsx
import { ProjectDetailsPage } from "@/components/projects/ProjectDetailsPage";
import { Metadata } from "next";

interface ProjectPageProps {
    params: {
        id: string;
    };
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
    return {
        title: `Projeto | DarkStack`,
        description: "Visualize os detalhes do projeto"
    };
}

export default function ProjectPage({ params }: ProjectPageProps) {
    return <ProjectDetailsPage projectId={params.id} />;
}