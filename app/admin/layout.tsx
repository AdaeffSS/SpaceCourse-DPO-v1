import { SidebarAdmin } from "@/components/layout/sidebar-admin";
import { AuthProvider } from "@/providers/auth-provider";
import {ReactNode} from "react";

export default function CabinetLayout({
                                          children,
                                      }: {
    children: ReactNode;
}) {
    return (
        <div className="bg-zinc-50">
            <div className="flex">
                <aside className="fixed left-0 top-0 h-screen w-72 border-r border-zinc-200 bg-white">
                    <SidebarAdmin />
                </aside>

                <main className="ml-72 flex-1">
                    <div className="mx-auto max-w-7xl p-8">{children}
                    </div>
                </main>
            </div>
        </div>
    );
}