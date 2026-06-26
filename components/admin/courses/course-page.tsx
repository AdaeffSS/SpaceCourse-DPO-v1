"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, FolderKanban, Trash2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

type CoursePlan = {
    id: string;
    price: number;
    hours: number;
    durationDays: number;
    type: "ATC" | "PRP";
};

type CoursePlanRelation = {
    planId: string;
    testHours: number;
    plan: CoursePlan;
};

type CourseDetails = {
    id: string;
    title: string;
    description: string | null;
    type: "ATC" | "PRP";
    isPublished: boolean;
    plans: CoursePlanRelation[];
    modules: {
        courseId: string;
        moduleId: string;
        order: number;
        module: {
            id: string;
            title: string;
            description: string | null;
        };
    }[];
    createdAt: string;
    updatedAt: string;
};

type Props = {
    id: string;
};

export function CoursePage({ id }: Props) {
    const router = useRouter();
    const [course, setCourse] = useState<CourseDetails | null>(null);
    const [allPlans, setAllPlans] = useState<CoursePlan[]>([]);
    const [selectedPlanId, setSelectedPlanId] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("ATC");
    const [isPublished, setIsPublished] = useState(false);

    useEffect(() => {
        loadData();
    }, [id]);

    async function loadData() {
        try {
            setLoading(true);
            const courseData = await api<CourseDetails>(`/admin/courses/${id}`);
            setCourse(courseData);

            setTitle(courseData.title);
            setDescription(courseData.description || "");
            setType(courseData.type);
            setIsPublished(courseData.isPublished);

            const plansData = await api<{ items: CoursePlan[] }>("/admin/course-plans/search", {
                method: "POST",
                body: JSON.stringify({ page: 1, pageSize: 100 }),
            });
            setAllPlans(plansData.items);
        } catch (err) {
            console.error("Ошибка загрузки данных курса:", err);
        } finally {
            setLoading(false);
        }
    }

    async function handleAttachPlan() {
        if (!selectedPlanId) return;
        try {
            await api(`/admin/courses/${id}/plans`, {
                method: "POST",
                body: JSON.stringify({ planId: selectedPlanId }),
            });
            setSelectedPlanId("");
            await loadData();
        } catch (err: any) {
            alert(err.message || "Не удалось привязать план");
        }
    }

    async function handleDetachPlan(planId: string) {
        if (!confirm("Отвязать этот план от текущего курса? Ведомость часов для него будет удалена.")) return;
        try {
            await api(`/admin/courses/${id}/plans/${planId}`, {
                method: "DELETE",
            });
            await loadData();
        } catch (err: any) {
            alert(err.message || "Не удалось отвязать план");
        }
    }

    async function save() {
        setSaving(true);
        try {
            await api(`/admin/courses/${id}`, {
                method: "PUT",
                body: JSON.stringify({
                    title,
                    description,
                    type,
                    isPublished,
                }),
            });
            router.push("/admin/courses");
            router.refresh();
        } catch (err) {
            alert("Не удалось сохранить изменения");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <div className="p-8 text-zinc-500">Загрузка данных курса...</div>;
    }

    if (!course) {
        return <div className="p-8 text-zinc-500">Курс не найден</div>;
    }

    const unattachedPlans = allPlans.filter(
        (ap) => !course.plans.some((cp) => cp.planId === ap.id)
    );

    return (
        <div className="space-y-8">
            <div>
                <Button variant="ghost" asChild className="mb-4 h-11 rounded-xl px-3">
                    <Link href="/admin/courses">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Назад к курсам
                    </Link>
                </Button>

                <div className="space-y-2">
                    <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">
                        {course.title}
                    </h1>
                    <p className="text-base text-zinc-600">
                        Редактирование параметров и привязка нормативно-финансовых планов
                    </p>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
                        <h2 className="mb-6 text-xl font-semibold text-zinc-950">
                            Основная информация
                        </h2>

                        <div className="space-y-5">
                            <div>
                                <label className="text-sm font-medium text-zinc-900">
                                    Название курса
                                </label>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="mt-2 h-11 w-full rounded-xl border border-zinc-200 px-4 outline-none focus:border-zinc-900 transition"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-zinc-900">
                                    Описание
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={5}
                                    className="mt-2 w-full rounded-xl border border-zinc-200 p-4 outline-none focus:border-zinc-900 transition"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-zinc-900">
                                    Тип контента
                                </label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value as any)}
                                    className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 outline-none focus:border-zinc-900 transition"
                                >
                                    <option value="ATC">Повышение квалификации (ATC)</option>
                                    <option value="PRP">Профессиональная переподготовка (PRP)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-zinc-950">
                                Структура и ведомости часов ({course.modules.length} модулей)
                            </h2>
                            <Button asChild variant="outline" className="rounded-xl">
                                <Link href={`/admin/courses/${id}/modules`}>
                                    Открыть конфигуратор
                                </Link>
                            </Button>
                        </div>
                        <p className="text-sm text-zinc-500 leading-relaxed">
                            Для настройки порядка следования учебных блоков, а также распределения академических часов по законодательным ведомостям нажмите кнопку управления структурой.
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
                        <h2 className="mb-4 text-xl font-semibold text-zinc-950">Публикация</h2>
                        <label className="flex items-center gap-3 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={isPublished}
                                onChange={(e) => setIsPublished(e.target.checked)}
                                className="h-4 w-4 rounded border-zinc-300 text-blue-600"
                            />
                            <span className="text-sm font-medium text-zinc-700">
                                Доступен для студентов
                            </span>
                        </label>
                    </div>

                    <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm space-y-4">
                        <h2 className="text-xl font-semibold text-zinc-950">Привязанные планы</h2>
                        
                        <div className="space-y-3">
                            {course.plans && course.plans.length > 0 ? (
                                course.plans.map((rel) => (
                                    <div 
                                        key={rel.planId}
                                        className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50 space-y-3"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <div className="font-semibold text-zinc-950 text-sm">
                                                    {rel.plan.hours} ак. часов
                                                </div>
                                                <div className="text-xs text-zinc-500 mt-0.5">
                                                    {rel.plan.durationDays} дн. • {rel.plan.price.toLocaleString("ru-RU")} ₽
                                                </div>
                                                <div className="text-[11px] text-purple-700 font-medium mt-1">
                                                    На тест: {rel.testHours} ч.
                                                </div>
                                            </div>
                                            <Button 
                                                size="icon" 
                                                variant="ghost" 
                                                className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg shrink-0"
                                                onClick={() => handleDetachPlan(rel.planId)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center p-4 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 text-xs text-zinc-500">
                                    К курсу пока не привязано ни одного плана. Студенты не смогут записаться.
                                </div>
                            )}
                        </div>

                        <div className="pt-4 border-t border-zinc-100 space-y-2">
                            <label className="text-xs font-semibold text-zinc-700">Привязать существующий план</label>
                            <div className="flex gap-2">
                                <select
                                    value={selectedPlanId}
                                    onChange={(e) => setSelectedPlanId(e.target.value)}
                                    className="h-10 flex-1 rounded-xl border border-zinc-200 bg-white px-3 text-xs outline-none"
                                >
                                    <option value="">-- Выберите шаблон --</option>
                                    {unattachedPlans.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.hours} ч. — {p.type} ({p.price.toLocaleString("ru-RU")} ₽)
                                        </option>
                                    ))}
                                </select>
                                <Button 
                                    size="icon" 
                                    className="h-10 w-10 rounded-xl shrink-0"
                                    disabled={!selectedPlanId}
                                    onClick={handleAttachPlan}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-zinc-200 pt-6">
                <Button
                    onClick={save}
                    disabled={saving}
                    className="rounded-xl h-11 px-6 shadow-sm"
                >
                    {saving ? "Сохранение..." : "Сохранить изменения курса"}
                </Button>
            </div>
        </div>
    );
}
