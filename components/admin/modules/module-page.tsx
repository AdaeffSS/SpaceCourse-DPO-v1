"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

import { ModuleDetails } from "@/types/module";

type Props = {
    id: string;
};

export function ModulePage({
                               id,
                           }: Props) {
    const router = useRouter();

    const [module, setModule] =
        useState<ModuleDetails | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [title, setTitle] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [status, setStatus] =
        useState<
            "DRAFT" |
            "ACTIVE" |
            "INACTIVE"
        >("DRAFT");

    const [
        completionType,
        setCompletionType,
    ] = useState<
        "MANUAL" |
        "TEST"
    >("MANUAL");

    useEffect(() => {
        loadModule();
    }, [id]);

    async function loadModule() {
        try {
            const data =
                await api<ModuleDetails>(
                    `/modules/${id}`
                );

            setModule(data);

            setTitle(data.title);

            setDescription(
                data.description || ""
            );

            setStatus(data.status);

            setCompletionType(
                data.completionType
            );
        } finally {
            setLoading(false);
        }
    }

    async function save() {
        try {
            setSaving(true);

            await api(
                `/modules/${id}`,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        title,
                        description,
                        status,
                        completionType,
                    }),
                }
            );

            router.replace(
                "/admin/modules"
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
        <div className="space-y-8">
            <div className="space-y-3">
                <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">
                    {module.title}
                </h1>

                <p className="text-zinc-600">
                    Управление учебным модулем
                </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-8">
                <h2 className="mb-6 text-xl font-semibold">
                    Основная информация
                </h2>

                <div className="space-y-5">
                    <div>
                        <label className="text-sm font-medium">
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
                                rounded-xl border
                                border-zinc-200 px-4
                            "
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">
                            Описание
                        </label>

                        <textarea
                            rows={6}
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                            className="
                                mt-2 w-full
                                rounded-xl border
                                border-zinc-200 p-4
                            "
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-8">
                <h2 className="mb-6 text-xl font-semibold">
                    Настройки
                </h2>

                <div className="grid gap-5 md:grid-cols-2">
                    <div>
                        <label className="text-sm font-medium">
                            Статус
                        </label>

                        <select
                            value={status}
                            onChange={(e) =>
                                setStatus(
                                    e.target
                                        .value as any
                                )
                            }
                            className="
                                mt-2 h-11 w-full
                                rounded-xl border
                                border-zinc-200 px-4
                            "
                        >
                            <option value="DRAFT">
                                Черновик
                            </option>

                            <option value="ACTIVE">
                                Активный
                            </option>

                            <option value="INACTIVE">
                                Архивный
                            </option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium">
                            Тип завершения
                        </label>

                        <select
                            value={
                                completionType
                            }
                            onChange={(e) =>
                                setCompletionType(
                                    e.target
                                        .value as any
                                )
                            }
                            className="
                                mt-2 h-11 w-full
                                rounded-xl border
                                border-zinc-200 px-4
                            "
                        >
                            <option value="MANUAL">
                                Ручное
                            </option>

                            <option value="TEST">
                                Тестирование
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            {completionType === "TEST" && (
                <div className="rounded-3xl border border-zinc-200 bg-white p-8">
                    <h2 className="mb-4 text-xl font-semibold">
                        Итоговый тест
                    </h2>

                    <div className="text-zinc-700">
                        {module.finalTest
                            ? module.finalTest.title
                            : "Не назначен"}
                    </div>
                </div>
            )}

            <div className="rounded-3xl border border-zinc-200 bg-white p-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                        Уроки
                    </h2>

                    <Link
                        href={`/admin/modules/${id}/lessons`}
                    >
                        <Button>
                            Управление уроками
                        </Button>
                    </Link>
                </div>

                <div className="mt-6">
                    <p className="text-sm text-zinc-500">
                        Всего уроков
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                        {
                            module.lessonsCount
                        }
                    </p>
                </div>

                <div className="mt-6 space-y-3">
                    {module.lessons.map(
                        (lesson) => (
                            <div
                                key={
                                    lesson.id
                                }
                                className="
                                    rounded-2xl
                                    border
                                    border-zinc-200
                                    p-4
                                "
                            >
                                {lesson.order}.{" "}
                                {
                                    lesson.title
                                }
                            </div>
                        )
                    )}
                </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-8">
                <h2 className="mb-6 text-xl font-semibold">
                    Использование
                </h2>

                <p className="text-zinc-600">
                    Используется в{" "}
                    {
                        module.coursesCount
                    }{" "}
                    программах
                </p>

                <div className="mt-4 space-y-3">
                    {module.courses.map(
                        (course) => (
                            <Link
                                key={
                                    course.id
                                }
                                href={`/admin/courses/${course.id}`}
                                className="
                                    block rounded-2xl
                                    border border-zinc-200
                                    p-4 hover:bg-zinc-50
                                "
                            >
                                {
                                    course.title
                                }
                            </Link>
                        )
                    )}
                </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-8">
                <h2 className="mb-6 text-xl font-semibold">
                    Системная информация
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <p className="text-sm text-zinc-500">
                            Создан
                        </p>

                        <p className="font-medium">
                            {new Date(
                                module.createdAt
                            ).toLocaleString(
                                "ru-RU"
                            )}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-zinc-500">
                            Обновлён
                        </p>

                        <p className="font-medium">
                            {new Date(
                                module.updatedAt
                            ).toLocaleString(
                                "ru-RU"
                            )}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <Button
                    onClick={save}
                    disabled={saving}
                    className="rounded-xl"
                >
                    {saving
                        ? "Сохранение..."
                        : "Сохранить"}
                </Button>
            </div>
        </div>
    );
}