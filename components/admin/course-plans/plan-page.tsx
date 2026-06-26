"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { CoursePlanDetails } from "@/types/course-plan";

type CourseModuleInfo = {
    id: string;
    title: string;
    modules: {
        moduleId: string;
        order: number;
        module: {
            id: string;
            title: string;
        };
    }[];
};

type Props = {
    id: string;
};

export function PlanPage({ id }: Props) {
    const router = useRouter();

    const [plan, setPlan] = useState<CoursePlanDetails | null>(null);
    const [courseStructure, setCourseStructure] = useState<CourseModuleInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Стейты базовых полей плана
    const [price, setPrice] = useState("");
    const [hours, setHours] = useState("");
    const [durationDays, setDurationDays] = useState("");

    // Стейт для хранения распределения законодательных часов по модулям
    // Структура: { [moduleId]: durationValue }
    const [hoursMap, setHoursMap] = useState<Record<string, number>>({});

    useEffect(() => {
        loadPlanAndCourse();
    }, [id]);

    async function loadPlanAndCourse() {
        try {
            setLoading(true);
            setError("");
            
            // 1. Загружаем данные плана
            const planData = await api<CoursePlanDetails>(`/admin/course-plans/${id}`);
            setPlan(planData);
            setPrice(String(planData.price));
            setHours(String(planData.hours));
            setDurationDays(String(planData.durationDays));

            // Заполняем карту часов теми значениями, что уже есть на бэке
            const initialHours: Record<string, number> = {};
            planData.moduleHours?.forEach((mh) => {
                initialHours[mh.moduleId] = mh.durationValue;
            });
            setHoursMap(initialHours);

            // 2. Зная courseId, подтягиваем его модули для отображения списка
            if (planData.courseId) {
                const courseData = await api<CourseModuleInfo>(`/admin/courses/${planData.courseId}`);
                setCourseStructure(courseData);
            }
        } catch (err: any) {
            setError(err.message || "Ошибка при загрузке данных плана");
        } finally {
            setLoading(false);
        }
    }

    const handleModuleHourChange = (moduleId: string, value: string) => {
        const numValue = parseInt(value, 10);
        setHoursMap((prev) => ({
            ...prev,
            [moduleId]: isNaN(numValue) ? 0 : numValue,
        }));
    };

    async function save() {
        setSaving(true);
        setError("");

        // Формируем массив moduleHours для отправки на бэкенд на основе структуры курса
        const moduleHoursPayload = courseStructure?.modules.map((m) => ({
            moduleId: m.moduleId,
            durationValue: hoursMap[m.moduleId] || 0,
        })) || [];

        try {
            await api(`/admin/course-plans/${id}`, {
                method: "PUT",
                body: JSON.stringify({
                    price: Number(price),
                    hours: Number(hours),
                    durationDays: Number(durationDays),
                    courseId: plan?.courseId,
                    moduleHours: moduleHoursPayload,
                }),
            });

            router.push("/admin/course-plans");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Не удалось сохранить изменения");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <div className="p-8 text-zinc-500">Загрузка данных плана...</div>;
    }

    if (!plan) {
        return <div className="p-8 text-zinc-500">План программы не найден</div>;
    }

    return (
        <div className="space-y-8">
            {/* Хедер */}
            <div>
                <Button variant="ghost" asChild className="mb-4 h-11 rounded-xl px-3">
                    <Link href={`/admin/courses/${plan.courseId}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Назад к программе
                    </Link>
                </Button>

                <div className="space-y-2">
                    <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">
                        Параметры тарифа и плана
                    </h1>
                    <p className="text-base text-zinc-600">
                        Программа курса: <strong className="text-zinc-900">{plan.course?.title}</strong>
                    </p>
                </div>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">
                    {error}
                </div>
            )}

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Левая колонка: Законодательные часы для модулей контента */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <BookOpen className="h-5 w-5 text-zinc-500" />
                            <h2 className="text-xl font-semibold text-zinc-950">
                                Ведомость распределения часов по модулям
                            </h2>
                        </div>
                        <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
                            Укажите академические часы или сроки прохождения для каждого модуля. Данные значения отображаются исключительно для выполнения нормативных регламентов ведомств.
                        </p>

                        <div className="space-y-4">
                            {courseStructure?.modules && courseStructure.modules.length > 0 ? (
                                [...courseStructure.modules]
                                    .sort((a, b) => a.order - b.order)
                                    .map((item, idx) => (
                                        <div
                                            key={item.moduleId}
                                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-zinc-200 p-5 bg-zinc-50 hover:bg-zinc-100/50 transition-colors"
                                        >
                                            <div className="font-medium text-zinc-900 pr-4">
                                                Модуль {idx + 1}. {item.module.title}
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={hoursMap[item.moduleId] !== undefined ? hoursMap[item.moduleId] : ""}
                                                    placeholder="0"
                                                    onChange={(e) => handleModuleHourChange(item.moduleId, e.target.value)}
                                                    className="h-11 w-24 rounded-xl border border-zinc-200 bg-white text-center font-semibold text-zinc-950 outline-none focus:border-zinc-900 transition"
                                                />
                                                <span className="text-sm font-medium text-zinc-500 w-16">
                                                    ак. ч.
                                                </span>
                                            </div>
                                        </div>
                                    ))
                            ) : (
                                <p className="text-sm text-zinc-500 py-4 text-center">
                                    В структуре этой программы пока нет модулей. Сначала добавьте модули на странице курса.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Правая колонка: Коммерческие и общие параметры */}
                <div className="space-y-6">
                    <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm space-y-5">
                        <div className="flex items-center gap-2.5 mb-2">
                            <Clock className="h-5 w-5 text-zinc-500" />
                            <h2 className="text-xl font-semibold text-zinc-950">Общие параметры</h2>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-zinc-900">
                                Стоимость обучения (₽)
                            </label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="mt-2 h-11 w-full rounded-xl border border-zinc-200 px-4 outline-none focus:border-zinc-900 transition"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-zinc-900">
                                Общий объем плана (ак. часов)
                            </label>
                            <input
                                type="number"
                                value={hours}
                                onChange={(e) => setHours(e.target.value)}
                                className="mt-2 h-11 w-full rounded-xl border border-zinc-200 px-4 outline-none focus:border-zinc-900 transition"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-zinc-900">
                                Срок прохождения (дней)
                            </label>
                            <input
                                type="number"
                                value={durationDays}
                                onChange={(e) => setDurationDays(e.target.value)}
                                className="mt-2 h-11 w-full rounded-xl border border-zinc-200 px-4 outline-none focus:border-zinc-900 transition"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Фиксированный подвал для сохранения изменений */}
            <div className="flex justify-end gap-3 border-t border-zinc-200 pt-6">
                <Button
                    onClick={save}
                    disabled={saving}
                    className="rounded-xl h-11 px-6 shadow-sm"
                >
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? "Сохранение..." : "Сохранить изменения плана"}
                </Button>
            </div>
        </div>
    );
}
