"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

import { ModuleLesson } from "@/types/module-lesson";

import { SelectLessonModal } from "@/components/admin/modules/modals/select-lesson-modal";
import { ModuleLessonItem } from "./module-lesson-item";

type ModuleInfo = {
    id: string;
    title: string;
};

type Props = {
    id: string;
};

export function ModuleLessonsPage({
                                      id,
                                  }: Props) {
    const router = useRouter();

    const [module, setModule] =
        useState<ModuleInfo | null>(
            null
        );

    const [lessons, setLessons] =
        useState<ModuleLesson[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [selectOpen, setSelectOpen] =
        useState(false);

    useEffect(() => {
        loadData();
    }, [id]);

    async function loadData() {
        try {
            const [
                moduleData,
                lessonsData,
            ] = await Promise.all([
                api<ModuleInfo>(
                    `/modules/${id}`
                ),

                api<ModuleLesson[]>(
                    `/modules/${id}/lessons`
                ),
            ]);

            setModule(moduleData);
            setLessons(lessonsData);
        } finally {
            setLoading(false);
        }
    }

    function moveUp(index: number) {
        if (index === 0) {
            return;
        }

        const copy = [...lessons];

        [copy[index - 1], copy[index]] =
            [
                copy[index],
                copy[index - 1],
            ];

        setLessons(copy);
    }

    function moveDown(index: number) {
        if (
            index ===
            lessons.length - 1
        ) {
            return;
        }

        const copy = [...lessons];

        [copy[index + 1], copy[index]] =
            [
                copy[index],
                copy[index + 1],
            ];

        setLessons(copy);
    }

    function removeLesson(
        lessonId: string
    ) {
        setLessons(
            lessons.filter(
                (lesson) =>
                    lesson.lessonId !==
                    lessonId
            )
        );
    }

    async function save() {
        try {
            setSaving(true);

            await api(
                `/modules/${id}/lessons`,
                {
                    method: "PUT",

                    body: JSON.stringify({
                        lessons:
                            lessons.map(
                                (
                                    lesson,
                                    index
                                ) => ({
                                    lessonId:
                                    lesson.lessonId,

                                    order:
                                        index +
                                        1,
                                })
                            ),
                    }),
                }
            );

            router.push(
                `/admin/modules/${id}`
            );
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div>
                Загрузка...
            </div>
        );
    }

    if (!module) {
        return (
            <div>
                Модуль не найден
            </div>
        );
    }

    return (
        <>
            <SelectLessonModal
                open={selectOpen}
                onClose={() =>
                    setSelectOpen(false)
                }
                selectedIds={lessons.map(
                    (lesson) =>
                        lesson.lessonId
                )}
                onSelect={(
                    lesson
                ) => {
                    setLessons(
                        (prev) => [
                            ...prev,
                            {
                                lessonId:
                                lesson.id,

                                order:
                                    prev.length +
                                    1,

                                lesson: {
                                    id: lesson.id,
                                    title:
                                    lesson.title,
                                },
                            },
                        ]
                    );
                }}
            />

            <div className="space-y-8">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">
                            Уроки модуля
                        </h1>

                        <p className="mt-2 text-zinc-600">
                            {module.title}
                        </p>
                    </div>

                    <Button
                        onClick={() =>
                            setSelectOpen(
                                true
                            )
                        }
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Добавить урок
                    </Button>
                </div>

                <div className="space-y-4">
                    {lessons.length ===
                        0 && (
                            <div
                                className="
                                rounded-3xl
                                border border-zinc-200
                                bg-white
                                p-10
                                text-center
                            "
                            >
                                <h2 className="text-lg font-semibold text-zinc-950">
                                    Уроков пока нет
                                </h2>

                                <p className="mt-2 text-zinc-600">
                                    Добавьте первый урок
                                    в модуль.
                                </p>
                            </div>
                        )}

                    {lessons.map(
                        (
                            lesson,
                            index
                        ) => (
                            <ModuleLessonItem
                                key={
                                    lesson.lessonId
                                }
                                lesson={
                                    lesson
                                }
                                index={
                                    index
                                }
                                isFirst={
                                    index ===
                                    0
                                }
                                isLast={
                                    index ===
                                    lessons.length -
                                    1
                                }
                                onMoveUp={() =>
                                    moveUp(
                                        index
                                    )
                                }
                                onMoveDown={() =>
                                    moveDown(
                                        index
                                    )
                                }
                                onRemove={
                                    removeLesson
                                }
                            />
                        )
                    )}
                </div>

                <div className="flex justify-end">
                    <Button
                        onClick={save}
                        disabled={saving}
                    >
                        {saving
                            ? "Сохранение..."
                            : "Сохранить"}
                    </Button>
                </div>
            </div>
        </>
    );
}