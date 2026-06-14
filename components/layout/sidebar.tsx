import Link from "next/link";
import {
    BookOpen,
    FileText,
    GraduationCap,
    User,
} from "lucide-react";

const menuItems = [
    {
        title: "Программы",
        href: "/programs",
        icon: GraduationCap,
    },
    {
        title: "Профили обучающихся",
        href: "/profiles",
        icon: BookOpen,
    },
    {
        title: "Документы",
        href: "/documents",
        icon: FileText,
    }
];

export function Sidebar() {
    return (
        <aside className="flex h-screen w-72 flex-col border-r border-zinc-200 bg-white">
            <div className="border-b border-zinc-200 p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                        <BookOpen size={20} />
                    </div>

                    <div>
                        <h1 className="font-semibold text-zinc-900">
                            СПЦ ДПО
                        </h1>

                        <p className="text-sm text-zinc-500">
                            Личный кабинет
                        </p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4">
                <div className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="
                  flex items-center gap-3
                  rounded-xl
                  px-4 py-3
                  text-sm font-medium
                  text-zinc-700
                  transition-all
                  hover:bg-zinc-100
                "
                            >
                                <Icon size={18} />
                                {item.title}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="font-medium text-zinc-900">
                    Иван Иванов
                </p>

                <div className="mt-2 flex gap-2">
        <span className="rounded-full bg-white px-2 py-1 text-xs text-zinc-600">
            3 программы
        </span>

                    <span className="rounded-full bg-white px-2 py-1 text-xs text-zinc-600">
            2 профиля
        </span>
                </div>
            </div>
        </aside>
    );
}