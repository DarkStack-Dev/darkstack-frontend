// app/projects/my-projects/page.tsx
import { MyProjectsPage } from "@/components/projects/MyProjectsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Meus Projetos | DarkStack",
    description: "Gerencie e acompanhe seus projetos"
};

export default function MyProjectsAppPage() {
    return <MyProjectsPage />;
}