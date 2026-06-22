import {
    ArrowRight,
    CalendarDays,
    GraduationCap,
    Lock,
    Pencil,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ProfileCardProps = {
    id: string;
    fullName: string;
    educationLevel: string;
    organizationName: string;
    specialty: string;
    coursesCount: number;
    updatedAt: string;
    isLocked: boolean;
};

export function ProfileCard({
                                id,
                                fullName,
                                educationLevel,
                                organizationName,
                                specialty,
                                coursesCount,
                                updatedAt,
                                isLocked,
                            }: ProfileCardProps) {
    return (
        <Card className="rounded-3xl border border-zinc-200/70 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
            <CardContent className="p-5 md:p-6">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-5">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                <GraduationCap className="h-5 w-5" />
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
                                    {fullName}
                                </h2>

                                <p className="mt-1 text-sm text-zinc-500">
                                    {educationLevel}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                                <p className="text-xs font-medium text-zinc-500">
                                    Организация
                                </p>

                                <p className="mt-2 text-sm font-medium leading-6 text-zinc-900">
                                    {organizationName}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                                <p className="text-xs font-medium text-zinc-500">
                                    Специальность
                                </p>

                                <p className="mt-2 text-sm font-medium leading-6 text-zinc-900">
                                    {specialty}
                                </p>
                            </div>
                        </div>

                        {isLocked ? (
                            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800">
                                <Lock className="h-4 w-4" />
                                Используется в {coursesCount} программах обучения
                            </div>
                        ) : (
                            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
                                <Pencil className="h-4 w-4" />
                                Профиль можно редактировать
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col items-start gap-3 md:items-end">
                        <p className="flex items-center gap-2 text-sm text-zinc-500">
                            <CalendarDays className="h-4 w-4" />
                            Обновлен {updatedAt}
                        </p>

                        <Button
                            asChild
                            className="h-11 rounded-xl px-5 text-sm font-medium"
                        >
                            <Link href={`/profiles/${id}`}>
                                {isLocked
                                    ? "Просмотреть профиль"
                                    : "Редактировать профиль"}

                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}