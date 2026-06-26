"use client";

import {
  BookOpen,
  Files,
  FileText,
  FolderKanban,
  GraduationCap,
} from "lucide-react";

import { BaseSidebar } from "./base-sidebar";

import { useAuth } from "@/providers/auth-provider";

const menuItems = [
  {
    title: "Планы курсов",
    href: "/admin/course-plans",
    icon: FolderKanban,
  },
  {
    title: "Курсы",
    href: "/admin/courses",
    icon: GraduationCap,
  },
  {
    title: "Модули",
    href: "/admin/modules",
    icon: BookOpen,
  },
  {
    title: "Уроки",
    href: "/admin/lessons",
    icon: FileText,
  },
  {
    title: "Файлы",
    href: "/admin/files",
    icon: Files,
  }
];

export function SidebarAdmin() {
  const { user } = useAuth();

  return (
      <BaseSidebar
          subtitle="Админ-панель"
          items={menuItems}
          switchLink={
            user?.roles?.includes("USER")
                ? {
                  title: "Обучающая панель",
                  href: "/",
                  icon: GraduationCap,
                }
                : undefined
          }
      />
  );
}