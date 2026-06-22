"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

import { Module } from "@/types/module";

import { ModuleCard } from "@/components/admin/modules/module-card";
import { CreateModuleModal } from "@/components/admin/modules/modals/create-module-modal";

export function ModulesPage() {
    const [modules, setModules] =
        useState<Module[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [createOpen, setCreateOpen] =
        useState(false);

    useEffect(() => {
        loadModules();
    }, []);

    async function loadModules() {
        try {
            const data =
                await api<Module[]>(
                    "/modules"
                );

            setModules(data);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <CreateModuleModal
                open={createOpen}
                onClose={() =>
                    setCreateOpen(false)
                }
            />

            <div className="space-y-8">
                <div className="flex items-start justify-between">
                    <div className="space-y-3">
                        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">
                            Модули
                        </h1>

                        <p className="max-w-2xl text-base text-zinc-600">
                            Управление учебными модулями.
                        </p>
                    </div>

                    <Button
                        className="h-11 rounded-xl px-5"
                        onClick={() =>
                            setCreateOpen(true)
                        }
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Создать модуль
                    </Button>
                </div>

                {loading ? (
                    <div className="rounded-3xl border border-zinc-200 bg-white p-6 text-zinc-500">
                        Загрузка...
                    </div>
                ) : modules.length === 0 ? (
                    <div className="rounded-3xl border border-zinc-200 bg-white p-10 text-center">
                        <h2 className="text-lg font-semibold text-zinc-950">
                            Пока нет ни одного модуля
                        </h2>

                        <p className="mt-2 text-zinc-600">
                            Создайте первый учебный модуль.
                        </p>

                        <Button
                            className="mt-6 rounded-xl"
                            onClick={() =>
                                setCreateOpen(true)
                            }
                        >
                            Создать модуль
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-5 lg:grid-cols-2">
                        {modules.map((module) => (
                            <ModuleCard
                                key={module.id}
                                module={module}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}