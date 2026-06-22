"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

import { Lesson } from "@/types/lesson";

import { LessonCard } from "@/components/admin/lessons/lesson-card";
import { CreateLessonModal } from "@/components/admin/lessons/modals/create-lesson-modal";

export function LessonsPage() {
    const [lessons, setLessons] =
        useState<Lesson[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [createOpen, setCreateOpen] =
        useState(false);

    useEffect(() => {
        loadLessons();
    }, []);

    async function loadLessons() {
        try {
            setError("");

            const data =
                await api<Lesson[]>(
                    "/lessons"
                );

            setLessons(data);
        } catch (err: any) {
            setError(
                err.message ||
                "Не удалось загрузить уроки"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <CreateLessonModal
                open={createOpen}
                onClose={() =>
                    setCreateOpen(false)
                }
                onCreated={loadLessons}
            />

            <div className="space-y-8">
                <div className="flex items-start justify-between">
                    <div className="space-y-3">
                        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">
                            Уроки
                        </h1>

                        <p className="max-w-2xl text-base text-zinc-600">
                            Управление учебными материалами.
                        </p>
                    </div>

                    <Button
                        className="h-11 rounded-xl px-5"
                        onClick={() =>
                            setCreateOpen(true)
                        }
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Создать урок
                    </Button>
                </div>

                {loading && (
                    <div className="rounded-3xl border border-zinc-200 bg-white p-6 text-zinc-500">
                        Загрузка...
                    </div>
                )}

                {!loading && error && (
                    <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-600">
                        {error}
                    </div>
                )}

                {!loading &&
                    !error &&
                    lessons.length === 0 && (
                        <div className="rounded-3xl border border-zinc-200 bg-white p-10 text-center">
                            <h2 className="text-lg font-semibold text-zinc-950">
                                Пока нет ни одного урока
                            </h2>

                            <p className="mt-2 text-zinc-600">
                                Создайте первый урок.
                            </p>

                            <Button
                                className="mt-6 rounded-xl"
                                onClick={() =>
                                    setCreateOpen(
                                        true
                                    )
                                }
                            >
                                Создать урок
                            </Button>
                        </div>
                    )}

                {!loading &&
                    !error &&
                    lessons.length > 0 && (
                        <div className="grid gap-5 lg:grid-cols-2">
                            {lessons.map(
                                (lesson) => (
                                    <LessonCard
                                        key={
                                            lesson.id
                                        }
                                        lesson={
                                            lesson
                                        }
                                    />
                                )
                            )}
                        </div>
                    )}
            </div>
        </>
    );
}