"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
    BadgeCheck,
    CalendarDays,
    Clock3,
    FileText,
    GraduationCap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DocumentStatus = "unavailable" | "processing" | "ready";

type ProgramDocument =
    | {
    kind: "program";
    label: string;
    description: string;
    actionLabel: string;
}
    | {
    kind: "enrollment" | "education";
    label: string;
    description: string;
    status: DocumentStatus;
    actionLabel: string;
};

export type ProgramCardProps = {
    id: number | string;
    title: string;
    typeLabel: string;
    durationHours: number;
    qualification: string;
    cost: string;
    completionLabel: string;
    completionDate: string;
    sendDocumentLabel: string;
    sendDocumentDate: string;
    programType: string;
    frdoDate: string;
    status: "active" | "completed";
    enrollmentLabel: string;
    documents: ProgramDocument[];
};

const statusStyles: Record<ProgramCardProps["status"], string> = {
    active: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
    completed: "bg-blue-100 text-blue-700 hover:bg-blue-100",
};

const documentStatusStyles: Record<DocumentStatus, string> = {
    unavailable: "bg-red-100 text-red-700",
    processing: "bg-amber-100 text-amber-700",
    ready: "bg-emerald-100 text-emerald-700",
};

const documentStatusLabels: Record<DocumentStatus, string> = {
    unavailable: "Недоступно",
    processing: "В работе",
    ready: "Готово",
};

function InfoTile({
                      label,
                      value,
                      icon,
                  }: {
    label: string;
    value: string;
    icon: ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-zinc-200/70 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-zinc-500">
                {icon}
                <p className="text-xs font-medium text-zinc-500">{label}</p>
            </div>
            <p className="text-sm leading-6 text-zinc-900">{value}</p>
        </div>
    );
}

function DocumentRow({
                         document,
                     }: {
    document: ProgramDocument;
}) {
    const icon =
        document.kind === "program" ? (
            <FileText className="h-4 w-4" />
        ) : document.kind === "enrollment" ? (
            <BadgeCheck className="h-4 w-4" />
        ) : (
            <GraduationCap className="h-4 w-4" />
        );

    const iconBg =
        document.kind === "program"
            ? "bg-blue-50 text-blue-600"
            : document.kind === "enrollment"
                ? "bg-amber-50 text-amber-600"
                : "bg-emerald-50 text-emerald-600";

    const isDownloadable =
        document.kind === "program" || document.status === "ready";

    return (
        <div
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
            className="flex items-start justify-between gap-4 rounded-2xl border border-zinc-200/70 bg-white p-4 transition-colors hover:bg-zinc-50"
        >
            <div className="flex min-w-0 items-start gap-3">
                <div
                    className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
                        iconBg
                    )}
                >
                    {icon}
                </div>

                <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-950">
                        {document.label}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                        {document.description}
                    </p>
                </div>
            </div>

            <div className="shrink-0">
                {isDownloadable ? (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            alert(document.label);
                        }}
                        type="button"
                        className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50"
                    >
                        {document.actionLabel}
                    </button>
                ) : (
                    <Badge
                        className={cn(
                            "h-9 rounded-full border-0 px-3 text-sm font-medium",
                            documentStatusStyles[document.status]
                        )}
                    >
                        {documentStatusLabels[document.status]}
                    </Badge>
                )}
            </div>
        </div>
    );
}

export function ProgramCard({
                                id,
                                programType,
                                title,
                                typeLabel,
                                durationHours,
                                qualification,
                                cost,
                                completionLabel,
                                completionDate,
                                sendDocumentLabel,
                                sendDocumentDate,
                                frdoDate,
                                status,
                                enrollmentLabel,
                                documents,
                            }: ProgramCardProps) {
    const router = useRouter();

    const openProgram = () => {
        router.push(`/programs/${id}`);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openProgram();
        }
    };

    return (
        <Card
            role="link"
            tabIndex={0}
            onClick={openProgram}
            onKeyDown={handleKeyDown}
            className={cn(
                "relative overflow-hidden rounded-3xl border border-zinc-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
                "cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
            )}
        >
            <div
                className={cn(
                    "absolute inset-y-0 left-0 w-1",
                    status === "active"
                        ? "bg-gradient-to-b from-emerald-500 to-emerald-300"
                        : "bg-gradient-to-b from-blue-500 to-blue-300"
                )}
            />

            <CardContent className="px-6 py-8 md:px-7 md:py-9">
                <div className="grid gap-6 xl:grid-cols-[1.3fr_0.95fr] xl:items-start">
                    <div className="space-y-5">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge
                                className={cn(
                                    "h-9 rounded-full border-0 px-4 text-sm font-medium",
                                    statusStyles[status]
                                )}
                            >
                                {status === "active" ? "Осваивается" : "Завершено"}
                            </Badge>

                            <Badge
                                variant="outline"
                                className="h-9 rounded-full border-zinc-200 bg-zinc-50 px-4 text-sm font-medium text-zinc-700"
                            >
                                {typeLabel}
                            </Badge>

                            <div className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                                <Clock3 className="h-4 w-4" />
                                {durationHours} часов
                            </div>
                        </div>

                        <h3 className="max-w-4xl text-[1.35rem] font-semibold leading-tight tracking-tight text-zinc-950 md:text-[1.55rem]">
                            {title}
                        </h3>

                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                            <BadgeCheck className="h-4 w-4" />
                            {enrollmentLabel}
                        </div>

                        <div className="rounded-2xl border border-zinc-200/70 bg-zinc-50/70 p-4">
                            <p className="mb-2 text-xs font-medium text-zinc-500">
                                Квалификация
                            </p>
                            <p className="text-sm leading-7 text-zinc-800 md:text-[15px]">
                                {qualification}
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <InfoTile
                                label="Стоимость"
                                value={cost}
                                icon={<FileText className="h-4 w-4" />}
                            />

                            <InfoTile
                                label={completionLabel}
                                value={completionDate}
                                icon={<CalendarDays className="h-4 w-4" />}
                            />

                            <InfoTile
                                label={sendDocumentLabel}
                                value={sendDocumentDate}
                                icon={<FileText className="h-4 w-4" />}
                            />

                            <InfoTile
                                label="Передача сведений в Рособрнадзор"
                                value={frdoDate}
                                icon={<GraduationCap className="h-4 w-4" />}
                            />
                        </div>
                    </div>

                    <div
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        className="rounded-3xl border border-zinc-200/70 bg-zinc-50/60 p-4"
                    >
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-zinc-950">
                                Документы по программе
                            </p>
                            <span className="text-sm text-zinc-500">
                                {documents.length} файла
                            </span>
                        </div>

                        <div className="space-y-3">
                            {documents.map((document) => (
                                <DocumentRow key={document.label} document={document} />
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}