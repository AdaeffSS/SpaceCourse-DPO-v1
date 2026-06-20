"use client";

import Link from "next/link";

import { Module } from "@/types/module";

type Props = {
    module: Module;
};

export function ModuleCard({
                               module,
                           }: Props) {
    return (
        <Link
            href={`/admin/modules/${module.id}`}
            className="
                rounded-3xl
                border border-zinc-200
                bg-white
                p-6
                transition
                hover:border-zinc-300
            "
        >
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-zinc-950">
                        {module.title}
                    </h2>

                    {module.description && (
                        <p className="mt-2 text-sm text-zinc-600">
                            {module.description}
                        </p>
                    )}
                </div>

                <span
                    className={
                        module.status === "ACTIVE"
                            ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                            : "rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700"
                    }
                >
                    {module.status}
                </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-zinc-500">
                        Тип завершения
                    </p>

                    <p className="mt-1 font-medium text-zinc-900">
                        {module.completionType}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-zinc-500">
                        Уроков
                    </p>

                    <p className="mt-1 font-medium text-zinc-900">
                        {module._count?.lessons ?? 0}
                    </p>
                </div>
            </div>

            <div className="mt-6 border-t border-zinc-100 pt-4">
                <p className="text-xs text-zinc-500">
                    {new Date(
                        module.createdAt
                    ).toLocaleString("ru-RU", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </p>
            </div>
        </Link>
    );
}