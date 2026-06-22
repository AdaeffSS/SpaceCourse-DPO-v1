"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

import { SelectModuleModal } from "@/components/admin/courses/modals/select-module-modal";
import { CourseModuleItem } from "@/components/admin/courses/course-module-item";

type CourseModule = {
    moduleId: string;
    order: number;

    module: {
        id: string;
        title: string;
        description: string | null;
    };
};

type Course = {
    id: string;
    title: string;

    modules: CourseModule[];
};

type Props = {
    id: string;
};

export function CourseModulesPage({
                                      id,
                                  }: Props) {
    const router = useRouter();

    const [course, setCourse] =
        useState<Course | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [selectOpen, setSelectOpen] =
        useState(false);

    const [modules, setModules] =
        useState<CourseModule[]>([]);

    useEffect(() => {
        loadCourse();
    }, [id]);

    async function loadCourse() {
        try {
            const data =
                await api<Course>(
                    `/courses/${id}`
                );

            const sorted =
                [...data.modules].sort(
                    (a, b) =>
                        a.order - b.order
                );

            setCourse(data);
            setModules(sorted);
        } finally {
            setLoading(false);
        }
    }

    function moveUp(index: number) {
        if (index === 0) {
            return;
        }

        const copy = [...modules];

        [copy[index - 1], copy[index]] =
            [
                copy[index],
                copy[index - 1],
            ];

        setModules(copy);
    }

    function moveDown(index: number) {
        if (
            index ===
            modules.length - 1
        ) {
            return;
        }

        const copy = [...modules];

        [copy[index + 1], copy[index]] =
            [
                copy[index],
                copy[index + 1],
            ];

        setModules(copy);
    }

    function removeModule(
        moduleId: string
    ) {
        setModules(
            modules.filter(
                (m) =>
                    m.moduleId !==
                    moduleId
            )
        );
    }

    async function save() {
        try {
            setSaving(true);

            await api(
                `/courses/${id}/modules`,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        modules:
                            modules.map(
                                (
                                    module,
                                    index
                                ) => ({
                                    moduleId:
                                    module.moduleId,
                                    order:
                                        index +
                                        1,
                                })
                            ),
                    }),
                }
            );

            router.push(
                `/admin/courses/${id}`
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

    if (!course) {
        return (
            <div>
                Курс не найден
            </div>
        );
    }

    return (
        <>
            <SelectModuleModal
                open={selectOpen}
                onClose={() =>
                    setSelectOpen(false)
                }
                selectedIds={modules.map(
                    (m) => m.moduleId
                )}
                onSelect={(module) => {
                    setModules((prev) => [
                        ...prev,
                        {
                            moduleId: module.id,
                            order: prev.length + 1,
                            module,
                        },
                    ]);
                }}
            />

            <div className="space-y-8">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">
                            Модули курса
                        </h1>

                        <p className="mt-2 text-zinc-600">
                            {course.title}
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
                        Добавить модуль
                    </Button>
                </div>

                <div className="space-y-4">
                    {modules.map(
                        (
                            module,
                            index
                        ) => (
                            <CourseModuleItem
                                key={
                                    module.moduleId
                                }
                                module={
                                    module
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
                                    modules.length -
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
                                    removeModule
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