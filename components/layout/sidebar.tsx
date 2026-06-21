"use client";

import {
    BookOpen,
    GraduationCap,
} from "lucide-react";

import { BaseSidebar } from "./base-sidebar";

import { useAuth } from "@/providers/auth-provider";

const menuItems = [
    {
        title: "Программы",
        href: "/",
        icon: GraduationCap,
    },
    {
        title: "Профили обучающихся",
        href: "/profiles",
        icon: BookOpen,
    },
];

export function Sidebar() {
    const { user } = useAuth();

    return (
        <BaseSidebar
            subtitle="Личный кабинет"
            items={menuItems}
            switchLink={
                user?.roles?.includes("ADMIN")
                    ? {
                        title: "Админ-панель",
                        href: "/admin",
                        icon: GraduationCap,
                    }
                    : undefined
            }
        />
    );
}