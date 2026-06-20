"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

type ModuleItem = {
    id: string;

    title: string;
    description: string | null;

    status:
        | "DRAFT"
        | "ACTIVE"
        | "INACTIVE";

    completionType:
        | "MANUAL"
        | "TEST";

    lessonsCount?: number;
    coursesCount?: number;
};

type Props = {
    open: boolean;

    onClose: () => void;

    selectedIds: string[];

    onSelect: (
        module: ModuleItem
    ) => void;
};

export function SelectModuleModal({
                                      open,
                                      onClose,
                                      selectedIds,
                                      onSelect,
                                  }: Props) {
    const [modules, setModules] =
        useState<ModuleItem[]>([]);

    const [search, setSearch] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        if (!open) {
            return;
        }

        loadModules();
    }, [open]);

    async function loadModules() {
        try {
            setLoading(true);

            const data =
                await api<ModuleItem[]>(
                    "/modules"
                );

            setModules(data);
        } finally {
            setLoading(false);
        }
    }

    const filteredModules =
        useMemo(() => {
            return modules.filter(
                (module) =>
                    module.title
                        .toLowerCase()
                        .includes(
                            search.toLowerCase()
                        )
            );
        }, [modules, search]);

    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
            <div className="flex max-h-[80vh] w-full max-w-4xl flex-col rounded-3xl bg-white">
                <div className="border-b border-zinc-200 p-6">
                    <h2 className="text-2xl font-semibold text-zinc-950">
                        Добавление модулей
                    </h2>

                    <p className="mt-2 text-sm text-zinc-600">
                        Выберите один или несколько модулей для курса.
                    </p>

                    <input
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        placeholder="Поиск модуля..."
                        className="
                            mt-4
                            h-11
                            w-full
                            rounded-xl
                            border border-zinc-200
                            px-4
                        "
                    />

                    {!loading && (
                        <p className="mt-3 text-sm text-zinc-500">
                            Найдено модулей:{" "}
                            {
                                filteredModules.length
                            }
                        </p>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div>
                            Загрузка...
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredModules.map(
                                (module) => {
                                    const selected =
                                        selectedIds.includes(
                                            module.id
                                        );

                                    return (
                                        <div
                                            key={
                                                module.id
                                            }
                                            className="
                                                rounded-2xl
                                                border border-zinc-200
                                                p-5
                                            "
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h3 className="font-semibold text-zinc-950">
                                                        {
                                                            module.title
                                                        }
                                                    </h3>

                                                    {module.description && (
                                                        <p className="mt-2 text-sm text-zinc-600">
                                                            {
                                                                module.description
                                                            }
                                                        </p>
                                                    )}

                                                    <div className="mt-4 flex flex-wrap gap-4 text-xs text-zinc-500">
                                                        <span>
                                                            Тип завершения:{" "}
                                                            {
                                                                module.completionType
                                                            }
                                                        </span>

                                                        {module.lessonsCount !==
                                                            undefined && (
                                                                <span>
                                                                Уроков:{" "}
                                                                    {
                                                                        module.lessonsCount
                                                                    }
                                                            </span>
                                                            )}

                                                        {module.coursesCount !==
                                                            undefined && (
                                                                <span>
                                                                Используется в курсах:{" "}
                                                                    {
                                                                        module.coursesCount
                                                                    }
                                                            </span>
                                                            )}
                                                    </div>
                                                </div>

                                                <Button
                                                    disabled={
                                                        selected
                                                    }
                                                    onClick={() =>
                                                        onSelect(
                                                            module
                                                        )
                                                    }
                                                >
                                                    {selected
                                                        ? "Добавлен"
                                                        : "Добавить"}
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                }
                            )}

                            {filteredModules.length ===
                                0 && (
                                    <div className="rounded-2xl border border-zinc-200 p-8 text-center text-zinc-500">
                                        Ничего не найдено
                                    </div>
                                )}
                        </div>
                    )}
                </div>

                <div className="border-t border-zinc-200 p-6">
                    <div className="flex justify-end">
                        <Button
                            variant="outline"
                            onClick={onClose}
                        >
                            Закрыть
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}