"use client"

import * as React from "react"
import {
    // BookOpen,
    // Bot,
    BrainCircuit,
    Command,
    // Frame,
    LayoutDashboard,
    // LayoutDashboardIcon,
    LifeBuoy,
    // Map,
    // PieChart,
    Send,
    // Settings2,
    // SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
// import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"


const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Detectar Pododermatite",
            url: "/ipf",
            icon: BrainCircuit,
            isActive: false,
            items: [
                {
                    title: "Detectar",
                    url: "/ipf",
                },
                {
                    title: "Fotos",
                    url: "/fotos",
                },
                // {
                //     title: "Settings",
                //     url: "#",
                // },
            ],
        },
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
            items: [
                {
                    title: "dashboard",
                    url: "/dashboard",
                },
                // {
                //     title: "Explorer",
                //     url: "#",
                // },
                // {
                //     title: "Quantum",
                //     url: "#",
                // },
            ],
        },
        // {
        //     title: "Documentation",
        //     url: "#",
        //     icon: BookOpen,
        //     items: [
        //         {
        //             title: "Introduction",
        //             url: "#",
        //         },
        //         {
        //             title: "Get Started",
        //             url: "#",
        //         },
        //         {
        //             title: "Tutorials",
        //             url: "#",
        //         },
        //         {
        //             title: "Changelog",
        //             url: "#",
        //         },
        //     ],
        // },
        // {
        //     title: "Settings",
        //     url: "#",
        //     icon: Settings2,
        //     items: [
        //         {
        //             title: "General",
        //             url: "#",
        //         },
        //         {
        //             title: "Team",
        //             url: "#",
        //         },
        //         {
        //             title: "Billing",
        //             url: "#",
        //         },
        //         {
        //             title: "Limits",
        //             url: "#",
        //         },
        //     ],
        // },
    ],
    navSecondary: [
        {
            title: "Support",
            url: "#",
            icon: LifeBuoy,
        },
        {
            title: "Feedback",
            url: "#",
            icon: Send,
        },
    ],
    // projects: [
    //     {
    //         name: "Design Engineering",
    //         url: "#",
    //         icon: Frame,
    //     },
    //     {
    //         name: "Sales & Marketing",
    //         url: "#",
    //         icon: PieChart,
    //     },
    //     {
    //         name: "Travel",
    //         url: "#",
    //         icon: Map,
    //     },
    // ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  
    return (
        <Sidebar variant="inset" collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <Command className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">NPCA AI</span>
                                    <span className="truncate text-xs">Enterprise</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            {/* <Image src={user?.avatar} className="w-10 h-10" alt="Avatar do usuário"
                width={40}
                height={40} /> */}
            <SidebarContent>
                <NavMain items={data.navMain} />
                {/* <NavProjects projects={data.projects} /> */}
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
                {/* user={data.user} */}
            </SidebarFooter>
        </Sidebar>
    )
}