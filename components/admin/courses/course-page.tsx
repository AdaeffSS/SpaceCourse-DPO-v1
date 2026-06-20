"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import {useRouter} from "next/navigation";

type CoursePlan = {
    id: string;
    price: number;
    hours: number;
    durationDays: number;
};

type CourseDetails = {
    id: string;

    title: string;
    description: string | null;

    type: "ATC" | "PRP";

    isPublished: boolean;

    plan: {
        id: string;
        price: number;
        hours: number;
        durationDays: number;
    };

    modules: {
        courseId: string;
        moduleId: string;
        order: number;

        module: {
            id: string;
            title: string;
            description: string | null;

            status: string;
            completionType: string;
            finalTestId: string | null;
        };
    }[];

    finalTestId: string | null;

    createdAt: string;
    updatedAt: string;
};

type Props = {
    id: string;
};

export function CoursePage({
                               id,
                           }: Props) {
    const [course, setCourse] =
        useState<CourseDetails | null>(null);

    const [plans, setPlans] =
        useState<CoursePlan[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [title, setTitle] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [type, setType] =
        useState("ATC");

    const [planId, setPlanId] =
        useState("");

    const [isPublished, setIsPublished] =
        useState(false);

    useEffect(() => {
        loadData();
    }, [id]);

    const router = useRouter();

    async function loadData() {
        try {
            const [
                courseData,
                plansData,
            ] = await Promise.all([
                api<CourseDetails>(
                    `/courses/${id}`
                ),
                api<CoursePlan[]>(
                    "/course-plans"
                ),
            ]);

            setCourse(courseData);
            setPlans(plansData);

            setTitle(courseData.title);

            setDescription(
                courseData.description || ""
            );

            setType(courseData.type);

            setPlanId(
                courseData.plan.id
            );

            setIsPublished(
                courseData.isPublished
            );
        } finally {
            setLoading(false);
        }
    }

    async function save() {
        setSaving(true);

        try {
            await api(
                `/courses/${id}`,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        title,
                        description,
                        type,
                        planId,
                        isPublished,
                    }),
                }
            );

            router.push("/admin/courses");
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
        <div className="space-y-8">
            <div className="space-y-3">
                <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">
                    {course.title}
                </h1>

                <p className="text-zinc-600">
                    Управление образовательной программой
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
                            className="mt-2 h-11 w-full rounded-xl border border-zinc-200 px-4"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">
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
                            className="mt-2 w-full rounded-xl border border-zinc-200 p-4"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">
                            Тип
                        </label>

                        <select
                            value={type}
                            onChange={(e) =>
                                setType(
                                    e.target.value
                                )
                            }
                            className="mt-2 h-11 w-full rounded-xl border border-zinc-200 px-4"
                        >
                            <option value="ATC">
                                ATC
                            </option>

                            <option value="PRP">
                                PRP
                            </option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium">
                            План программы
                        </label>

                        <select
                            value={planId}
                            onChange={(e) =>
                                setPlanId(
                                    e.target.value
                                )
                            }
                            className="mt-2 h-11 w-full rounded-xl border border-zinc-200 px-4"
                        >
                            {plans.map((plan) => (
                                <option
                                    key={plan.id}
                                    value={plan.id}
                                >
                                    {plan.hours} ч. • {plan.durationDays} дн. • {plan.price} ₽
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-8">
                <h2 className="mb-6 text-xl font-semibold">
                    Публикация
                </h2>

                <label className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={isPublished}
                        onChange={(e) =>
                            setIsPublished(
                                e.target.checked
                            )
                        }
                    />

                    <span>
                        Опубликована
                    </span>
                </label>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-8">
                <h2 className="mb-6 text-xl font-semibold">
                    Статистика
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <div className="text-sm text-zinc-500">
                            Модулей
                        </div>

                        <div className="mt-1 font-medium">
                            {course.modules.length}
                        </div>
                    </div>

                    <div>
                        <div className="text-sm text-zinc-500">
                            Итоговый тест
                        </div>

                        <div className="mt-1 font-medium">
                            {course.finalTestId
                                ? "Назначен"
                                : "Не назначен"}
                        </div>
                    </div>

                    <div>
                        <div className="text-sm text-zinc-500">
                            Создана
                        </div>

                        <div className="mt-1 font-medium">
                            {new Date(
                                course.createdAt
                            ).toLocaleString("ru-RU")}
                        </div>
                    </div>

                    <div>
                        <div className="text-sm text-zinc-500">
                            Обновлена
                        </div>

                        <div className="mt-1 font-medium">
                            {new Date(
                                course.updatedAt
                            ).toLocaleString("ru-RU")}
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-8">
                <h2 className="mb-6 text-xl font-semibold">
                    Модули курса
                </h2>

                <div className="space-y-3">
                    {course.modules
                        .sort(
                            (a, b) =>
                                a.order - b.order
                        )
                        .map((item) => (
                            <div
                                key={
                                    item.module.id
                                }
                                className="rounded-2xl border border-zinc-200 p-4"
                            >
                                <div className="font-medium">
                                    {item.order}.{" "}
                                    {
                                        item
                                            .module
                                            .title
                                    }
                                </div>
                            </div>
                        ))}
                </div>

                <Link
                    href={`/admin/courses/${id}/modules`}
                >
                    <Button className="mt-6 rounded-xl">
                        Управление модулями
                    </Button>
                </Link>
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