"use client";

import { useMemo, useState } from "react";

import { ProgramCard } from "@/components/programs/program-card";

const programs = [
    {
        id: 1,
        title:
            "Методика преподавания выбранной дисциплины в организациях СОО и ООО",
        typeLabel: "Программа повышения квалификации",
        programType: "КПК",
        durationHours: 72,
        qualification: "Преподаватель выбранной дисциплины в организациях СОО и ООО",
        cost: "3 500 ₽",
        completionLabel: "Планируемая дата завершения обучения",
        completionDate: "14 июля 2026 г.",
        sendDocumentLabel: "Планируемая дата отправки документа об образовании",
        sendDocumentDate: "14 июля 2026 г.",
        frdoDate: "16 июля 2026 г.",
        status: "active" as const,
        enrollmentLabel: "Вы зачислены на курс",
        documents: [
            {
                kind: "program" as const,
                label: "Рабочая программа",
                description: "Открыть PDF и скачать",
                actionLabel: "Скачать",
            },
            {
                kind: "enrollment" as const,
                label: "Справка о зачислении",
                description: "Подготовлен документ для печати",
                status: "processing" as const,
                actionLabel: "В работе",
                actionDisabled: true,
            },
            {
                kind: "education" as const,
                label: "Документ об образовании",
                description: "Пока недоступен",
                status: "unavailable" as const,
                actionLabel: "Недоступно",
                actionDisabled: true,
            },
        ],
    },
    {
        id: 2,
        title:
            "Современные технологии дистанционного обучения и проектирование цифровых курсов",
        typeLabel: "Курс профессиональной переподготовки",
        programType: "КПП",
        durationHours: 144,
        qualification: "Специалист по дистанционному обучению",
        cost: "7 900 ₽",
        completionLabel: "Планируемая дата завершения обучения",
        completionDate: "28 августа 2026 г.",
        sendDocumentLabel: "Планируемая дата отправки документа об образовании",
        sendDocumentDate: "29 августа 2026 г.",
        frdoDate: "31 августа 2026 г.",
        status: "active" as const,
        enrollmentLabel: "Вы зачислены на курс",
        documents: [
            {
                kind: "program" as const,
                label: "Рабочая программа",
                description: "Открыть PDF и скачать",
                actionLabel: "Скачать",
            },
            {
                kind: "enrollment" as const,
                label: "Справка о зачислении",
                description: "Подготовлен документ для печати",
                status: "processing" as const,
                actionLabel: "В работе",
                actionDisabled: true,
            },
            {
                kind: "education" as const,
                label: "Документ об образовании",
                description: "Появится после завершения",
                status: "unavailable" as const,
                actionLabel: "Недоступно",
                actionDisabled: true,
            },
        ],
    },
    {
        id: 3,
        title: "Организация образовательного процесса в цифровой среде",
        typeLabel: "Курс профессиональной переподготовки",
        programType: "КПП",
        durationHours: 108,
        qualification: "Педагог дополнительного образования",
        cost: "6 400 ₽",
        completionLabel: "Дата завершения обучения",
        completionDate: "14 июля 2026 г.",
        sendDocumentLabel: "Дата отправки документа об образовании",
        sendDocumentDate: "14 июля 2026 г.",
        frdoDate: "16 июля 2026 г.",
        status: "completed" as const,
        enrollmentLabel: "Документ об образовании получен",
        documents: [
            {
                kind: "program" as const,
                label: "Рабочая программа",
                description: "Открыть PDF и скачать",
                actionLabel: "Скачать",
            },
            {
                kind: "enrollment" as const,
                label: "Справка о зачислении",
                description: "Документ готов к скачиванию",
                status: "ready" as const,
                actionLabel: "Скачать",
            },
            {
                kind: "education" as const,
                label: "Документ об образовании",
                description: "Получен обучающимся",
                status: "ready" as const,
                actionLabel: "Скачать",
            },
        ],
    },
];

export default function ProgramsPage() {
    const [filter, setFilter] = useState<"all" | "kpk" | "kpp">("all");

    const filteredPrograms = useMemo(() => {
        switch (filter) {
            case "kpk":
                return programs.filter(
                    (program) => program.programType === "КПК"
                );

            case "kpp":
                return programs.filter(
                    (program) => program.programType === "КПП"
                );

            default:
                return programs;
        }
    }, [filter]);

    return (
        <div className="space-y-8">
            <div className="space-y-3">
                <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">
                    Мои программы
                </h1>

                <p className="max-w-2xl text-base text-zinc-600">
                    Здесь собраны все ваши образовательные программы,
                    статусы обучения и документы по каждому курсу.
                </p>
            </div>

            <div className="flex">
                <div className="inline-flex rounded-2xl border border-zinc-200 bg-white p-1 shadow-sm">
                    <button
                        onClick={() => setFilter("all")}
                        className={`h-10 rounded-xl px-5 text-sm font-medium transition-all ${
                            filter === "all"
                                ? "bg-zinc-900 text-white shadow-sm"
                                : "text-zinc-600 hover:bg-zinc-100"
                        }`}
                    >
                        Все
                    </button>

                    <button
                        onClick={() => setFilter("kpk")}
                        className={`h-10 rounded-xl px-5 text-sm font-medium transition-all ${
                            filter === "kpk"
                                ? "bg-zinc-900 text-white shadow-sm"
                                : "text-zinc-600 hover:bg-zinc-100"
                        }`}
                    >
                        КПК
                    </button>

                    <button
                        onClick={() => setFilter("kpp")}
                        className={`h-10 rounded-xl px-5 text-sm font-medium transition-all ${
                            filter === "kpp"
                                ? "bg-zinc-900 text-white shadow-sm"
                                : "text-zinc-600 hover:bg-zinc-100"
                        }`}
                    >
                        КПП
                    </button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-zinc-200/70 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
                    <p className="text-sm text-zinc-500">Всего программ</p>
                    <p className="mt-2 text-3xl font-semibold text-zinc-950">
                        {filteredPrograms.length}
                    </p>
                </div>

                <div className="rounded-3xl border border-zinc-200/70 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
                    <p className="text-sm text-zinc-500">Активные</p>
                    <p className="mt-2 text-3xl font-semibold text-emerald-600">
                        {
                            filteredPrograms.filter(
                                (program) => program.status === "active"
                            ).length
                        }
                    </p>
                </div>

                <div className="rounded-3xl border border-zinc-200/70 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
                    <p className="text-sm text-zinc-500">Завершённые</p>
                    <p className="mt-2 text-3xl font-semibold text-blue-600">
                        {
                            filteredPrograms.filter(
                                (program) => program.status === "completed"
                            ).length
                        }
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                {filteredPrograms.map((program) => (
                    <ProgramCard
                        key={program.id}
                        {...program}
                    />
                ))}
            </div>
        </div>
    );
}