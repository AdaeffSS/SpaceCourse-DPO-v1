import { LucideIcon } from "lucide-react";

export type SidebarItem = {
    title: string;
    href: string;
    icon: LucideIcon;
};

export type SidebarSwitchLink = {
    title: string;
    href: string;
    icon: LucideIcon;
};

export type BaseSidebarProps = {
    subtitle: string;
    items: SidebarItem[];
    switchLink?: SidebarSwitchLink;
};