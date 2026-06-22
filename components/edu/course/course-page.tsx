import {
    ArrowLeft,
    CheckCircle2,
    Clock3,
    FileText,
    PlayCircle,
    ShieldAlert,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {ProfileSelector} from "@/components/edu/profiles/profile-selector";

type Material = {
    title: string;
    description: string;
};

type Module = {
    id: number;
    title: string;
    hours: number;
    status: "done" | "progress" | "test";
    completedAt?: string;
    materials: Material[];
    actionLabel?: string;
    actionDisabled?: boolean;
    note?: string;
};

const modules: Module[] = [
    {
        id: 1,
        title:
            "Основы законодательства Российской Федерации в области физической культуры и спорта",
        hours: 12,
        status: "done",
        completedAt: "Модуль пройден 14 июня 2026 года в 13:43",
        materials: [
            { title: "Основные типы заданий и их решения", description: "PDF · 1.2КБ" },
            { title: "Основные типы заданий и их решения", description: "PDF · 1.2КБ" },
            { title: "Основные типы заданий и их решения", description: "PDF · 1.2КБ" },
        ],
    },
    {
        id: 2,
        title:
            "Основы законодательства Российской Федерации в области физической культуры и спорта",
        hours: 12,
        status: "progress",
        materials: [
            { title: "Основные типы заданий и их решения", description: "PDF · 1.2КБ" },
            { title: "Основные типы заданий и их решения", description: "PDF · 1.2КБ" },
            { title: "Основные типы заданий и их решения", description: "PDF · 1.2КБ" },
        ],
        actionLabel: "Отметить пройденным",
    },
    {
        id: 3,
        title:
            "Основы законодательства Российской Федерации в области физической культуры и спорта",
        hours: 12,
        status: "test",
        materials: [
            { title: "Основные типы заданий и их решения", description: "PDF · 1.2КБ" },
            { title: "Основные типы заданий и их решения", description: "PDF · 1.2КБ" },
            { title: "Основные типы заданий и их решения", description: "PDF · 1.2КБ" },
        ],
        actionLabel: "Пройти тест",
        note:
            "Чтобы отметить модуль пройденным, необходимо пройти тест. После успешного прохождения теста модуль считается завершенным автоматически.",
    },
];

function StatusBadge({
                         children,
                         variant,
                     }: {
    children: React.ReactNode;
    variant: "green" | "gray" | "amber" | "red";
}) {
    const styles = {
        green: "bg-emerald-100 text-emerald-700",
        gray: "bg-zinc-100 text-zinc-700",
        amber: "bg-amber-100 text-amber-800",
        red: "bg-red-100 text-red-700",
    }[variant];

    return (
        <Badge
            className={cn(
                "h-9 rounded-full px-4 text-sm font-medium border-0 whitespace-nowrap",
                styles
            )}
        >
            {children}
        </Badge>
    );
}

function ProgramHeroCard() {
    return (
        <Card className="rounded-3xl border border-zinc-200/70 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
            <CardContent className="p-5 md:p-6">
                <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge variant="gray">Курс повышения квалификации</StatusBadge>
                    <StatusBadge variant="green">Статус: Осваивается</StatusBadge>
                </div>

                <div className="mt-5 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="max-w-4xl">
                        <h1 className="text-[1.6rem] font-semibold tracking-tight text-zinc-950 md:text-[1.9rem]">
                            Методика преподавания выбранной дисциплины в организациях СОО и ООО
                        </h1>

                        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
                            <CheckCircle2 className="h-4 w-4" />
                            Вы зачислены на курс
                        </div>

                        <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                            <div>
                                <p className="text-xs font-medium text-zinc-500">
                                    Присваиваемая квалификация
                                </p>

                                <p className="mt-2 text-base font-medium leading-7 text-zinc-900">
                                    Преподаватель выбранной дисциплины в организации СОО и ООО
                                </p>
                            </div>

                            <div className="mt-5 grid gap-y-4 md:grid-cols-2 md:gap-x-8">
                                <div>
                                    <p className="text-xs font-medium text-zinc-500">
                                        Стоимость обучения
                                    </p>

                                    <p className="mt-1 text-lg font-semibold text-zinc-900">
                                        3 500 ₽
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-zinc-500">
                                        Длительность
                                    </p>

                                    <p className="mt-1 text-lg font-semibold text-zinc-900">
                                        72 часа
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-zinc-500">
                                        Планируемое завершение обучения
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-zinc-900">
                                        14 июля 2026 г.
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-zinc-500">
                                        Отправка документа об образовании
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-zinc-900">
                                        14 июля 2026 г.
                                    </p>
                                </div>

                                <div className="md:col-span-2">
                                    <p className="text-xs font-medium text-zinc-500">
                                        Передача сведений в Рособрнадзор
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-zinc-900">
                                        16 июля 2026 г.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-base font-medium whitespace-nowrap text-emerald-700">
                        <Clock3 className="h-5 w-5" />
                        72 часа
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function ProgressCard() {
    const progress = 90;

    return (
        <Card className="rounded-3xl border border-zinc-200/70 bg-white">
            <CardContent className="p-6">
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
                Ваш прогресс: {progress}%
            </h2>

            <div className="h-4 w-full overflow-hidden rounded-full bg-zinc-200">
                <div
                    className="h-full rounded-full bg-emerald-600"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <p className="max-w-5xl text-base leading-6 text-zinc-700">
                Для получения документа об образовании все модули курса должны быть
                пройдены, после чего Вам необходимо пройти итоговый тест. Количество
                попыток прохождения итогового теста не ограничено.
            </p>
        </div>
            </CardContent>
        </Card>
    );
}

function ModuleCard({ module }: { module: Module }) {
    const badge =
        module.status === "done" ? (
            <StatusBadge variant="green">Статус: Пройден</StatusBadge>
        ) : module.status === "progress" ? (
            <StatusBadge variant="gray">Статус: В процессе</StatusBadge>
        ) : (
            <StatusBadge variant="amber">Статус: Требуется тест</StatusBadge>
        );

    return (
        <Card className="rounded-3xl border border-zinc-200/70 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
            <CardContent className="p-5 md:p-6">
                <div className="flex flex-wrap items-center gap-2">
                    {badge}
                    <StatusBadge variant="gray">Количество часов: {module.hours}</StatusBadge>
                </div>

                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-950">
                    Модуль {module.id}. {module.title}
                </h3>

                <p className="mt-3 text-sm text-zinc-600">
                    Вы можете ознакомиться с учебными материалами модуля в удобное для Вас
                    время:
                </p>

                <div className="mt-4 space-y-3">
                    {module.materials.map((material, index) => (
                        <div
                            key={`${module.id}-${index}`}
                            className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 shadow-sm transition-colors hover:bg-zinc-100"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <FileText className="h-4 w-4" />
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-zinc-950">
                                        {material.title}
                                    </p>
                                    <p className="text-xs text-zinc-500">{material.description}</p>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                className="h-10 shrink-0 rounded-xl px-4 text-sm"
                            >
                                Скачать
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center">
                    {module.status === "done" ? (
                        <Button variant="outline" className="h-11 rounded-xl px-4 text-sm">
                            {module.completedAt}
                        </Button>
                    ) : module.status === "progress" ? (
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-10 rounded-xl px-4"
                        >
                            Отметить пройденным
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-10 rounded-xl px-4"
                            >
                                <PlayCircle className="h-4 w-4" />
                                Пройти тест
                            </Button>

                            {module.note ? (
                                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 font-medium text-amber-900">
                                    {module.note}
                                </div>
                            ) : null}
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function FinalTestCard() {
    return (
        <Card className="rounded-3xl border border-zinc-200/70 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
            <CardContent className="p-5 md:p-6">
                <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge variant="red">Статус: Недоступно</StatusBadge>
                    <StatusBadge variant="gray">Количество часов: 2</StatusBadge>
                </div>

                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-950">
                    Итоговое тестирование
                </h3>


                <div className="mt-4 space-y-4">
                    <div className="grid gap-3 md:grid-cols-3">
                        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                            <p className="text-xs text-zinc-500">
                                Количество вопросов
                            </p>

                            <p className="mt-1 text-lg font-semibold text-zinc-900">
                                10
                            </p>
                        </div>

                        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                            <p className="text-xs text-zinc-500">
                                Количество попыток
                            </p>

                            <p className="mt-1 text-lg font-semibold text-zinc-900">
                                Не ограничено
                            </p>
                        </div>

                        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                            <p className="text-xs text-zinc-500">
                                Время прохождения
                            </p>

                            <p className="mt-1 text-lg font-semibold text-zinc-900">
                                30 минут
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 font-medium text-amber-900">
                        Итоговое тестирование недоступно, пока все модули не отмечены как
                        пройденные. Как только Вы пройдете все модули курса, Вы сможете
                        приступить к итоговому тестированию.
                    </div>
                    <Button
                        variant="secondary"
                        className="h-11 rounded-xl px-5 text-sm font-medium"
                        disabled
                    >
                        Начать тестирование
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export function CoursePage() {
    return (
        <div className="space-y-8">
            <div>
                <Button variant="ghost" asChild className="mb-4 h-11 rounded-xl px-3">
                    <Link href="/public">
                        <ArrowLeft className="h-4 w-4" />
                        Назад к программам
                    </Link>
                </Button>

                <ProgramHeroCard />
            </div>
                <ProfileSelector
                    fullName="Иванов Иван Иванович"
                    educationLevel="Высшее образование"
                    organizationName="МГТУ им. Н. Э. Баумана"
                />

            <ProgressCard />

            <div className="space-y-6">
                {modules.map((module) => (
                    <ModuleCard key={module.id} module={module} />
                ))}
            </div>

            <FinalTestCard />
        </div>
    );
}