import { Plus } from "lucide-react";
import Link from "next/link";

import { ProfileCard } from "@/components/profiles/profile-card";
import { Button } from "@/components/ui/button";

const profiles = [
    {
        id: "1",
        fullName: "Иванов Иван Иванович",
        educationLevel: "Высшее образование",
        organizationName: "МГТУ им. Н. Э. Баумана",
        specialty: "Педагогика и методика преподавания",
        coursesCount: 3,
        updatedAt: "14 июня 2026 г.",
        isLocked: true,
    },
    {
        id: "2",
        fullName: "Петрова Анна Сергеевна",
        educationLevel: "Среднее профессиональное образование",
        organizationName: "Колледж информационных технологий",
        specialty: "Информационные системы и программирование",
        coursesCount: 0,
        updatedAt: "12 июня 2026 г.",
        isLocked: false,
    },
    {
        id: "3",
        fullName: "Смирнов Дмитрий Олегович",
        educationLevel: "Высшее образование",
        organizationName: "Российский университет спорта",
        specialty: "Физическая культура",
        coursesCount: 2,
        updatedAt: "10 июня 2026 г.",
        isLocked: true,
    },
];

export default function ProfilesPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="space-y-3">
                    <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">
                        Профили обучающихся
                    </h1>

                    <p className="max-w-3xl text-base leading-6 text-zinc-600">
                        Один аккаунт может содержать несколько профилей обучающихся.
                        При записи на программу Вы выбираете один из профилей.
                        После зачисления профиль закрепляется за программой и не
                        может быть изменён.
                    </p>
                </div>

                <Button
                    asChild
                    className="h-11 rounded-xl px-5 text-sm font-medium"
                >
                    <Link href="/profiles/create">
                        <Plus className="h-4 w-4" />
                        Создать профиль обучающегося
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-zinc-200/70 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
                    <p className="text-sm text-zinc-500">
                        Всего профилей
                    </p>

                    <p className="mt-2 text-3xl font-semibold text-zinc-950">
                        {profiles.length}
                    </p>
                </div>

                <div className="rounded-3xl border border-zinc-200/70 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
                    <p className="text-sm text-zinc-500">
                        Используются в обучении
                    </p>

                    <p className="mt-2 text-3xl font-semibold text-emerald-600">
                        {profiles.filter((p) => p.isLocked).length}
                    </p>
                </div>

                <div className="rounded-3xl border border-zinc-200/70 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
                    <p className="text-sm text-zinc-500">
                        Доступны для редактирования
                    </p>

                    <p className="mt-2 text-3xl font-semibold text-blue-600">
                        {profiles.filter((p) => !p.isLocked).length}
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                {profiles.map((profile) => (
                    <ProfileCard
                        key={profile.id}
                        {...profile}
                    />
                ))}
            </div>
        </div>
    );
}