"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

type Props = {
    open: boolean;
    onClose: () => void;
};

export function CreateModuleModal({
                                      open,
                                      onClose,
                                  }: Props) {
    const router = useRouter();

    const [title, setTitle] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    if (!open) {
        return null;
    }

    async function createModule() {
        try {
            setLoading(true);

            const module =
                await api<{
                    id: string;
                }>("/modules", {
                    method: "POST",
                    body: JSON.stringify({
                        title,
                        description,
                    }),
                });

            router.push(
                `/admin/modules/${module.id}`
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
            <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-xl">
                <h2 className="text-2xl font-semibold text-zinc-950">
                    Создание модуля
                </h2>

                <p className="mt-2 text-sm text-zinc-600">
                    Укажите основные сведения о модуле.
                </p>

                <div className="mt-8 space-y-5">
                    <div>
                        <label className="text-sm font-medium text-zinc-900">
                            Название
                        </label>

                        <input
                            value={title}
                            onChange={(e) =>
                                setTitle(
                                    e.target.value
                                )
                            }
                            className="
                                mt-2 h-11 w-full
                                rounded-xl
                                border border-zinc-200
                                px-4
                            "
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-zinc-900">
                            Описание
                        </label>

                        <textarea
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                            rows={5}
                            className="
                                mt-2 w-full
                                rounded-xl
                                border border-zinc-200
                                p-4
                            "
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        Отмена
                    </Button>

                    <Button
                        onClick={createModule}
                        disabled={
                            loading ||
                            !title.trim()
                        }
                    >
                        {loading
                            ? "Создание..."
                            : "Создать"}
                    </Button>
                </div>
            </div>
        </div>
    );
}