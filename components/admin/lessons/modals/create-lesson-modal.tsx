"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

type Props = {
    open: boolean;
    onClose: () => void;
    onCreated?: () => void;
};

export function CreateLessonModal({
                                      open,
                                      onClose,
                                      onCreated,
                                  }: Props) {
    const router = useRouter();

    const [title, setTitle] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    if (!open) {
        return null;
    }

    async function create() {
        if (!title.trim()) {
            return;
        }

        try {
            setLoading(true);

            const lesson =
                await api<{
                    id: string;
                }>("/lessons", {
                    method: "POST",
                    body: JSON.stringify({
                        title,
                    }),
                });

            onCreated?.();

            onClose();

            router.push(
                `/admin/lessons/${lesson.id}`
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
            <div className="w-full max-w-lg rounded-3xl bg-white p-8">
                <h2 className="text-2xl font-semibold text-zinc-950">
                    Создать урок
                </h2>

                <p className="mt-2 text-zinc-600">
                    Укажите название нового урока.
                </p>

                <div className="mt-6">
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
                            mt-2
                            h-11
                            w-full
                            rounded-xl
                            border border-zinc-200
                            px-4
                        "
                    />
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        Отмена
                    </Button>

                    <Button
                        onClick={create}
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