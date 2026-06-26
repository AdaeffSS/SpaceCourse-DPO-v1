"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

type LessonInfo = {
    id: string;
    title: string;
};

type ModuleDetails = {
    id: string;
    title: string;
    description: string | null;
    status: "DRAFT" | "ACTIVE" | "INACTIVE";
    completionType: "TEST" | "MANUAL";
    lessons: { lessonId: string; order: number; lesson: LessonInfo }[];
    courses: { course: { id: string; title: string } }[];
};

export function ModulePage({ id }: { id: string }) {
    const router = useRouter();
    const [module, setModule] = useState<ModuleDetails | null>(null);
    const [allLessons, setAllLessons] = useState<LessonInfo[]>([]);
    
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("DRAFT");
    const [completionType, setCompletionType] = useState("MANUAL");
    const [selectedLessonId, setSelectedModuleLessonId] = useState("");
    const [localLessons, setLocalModulesLessons] = useState<{ lessonId: string; order: number; lesson: LessonInfo }[]>([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        loadData();
    }, [id]);

    async function loadData() {
        try {
            setLoading(true);
            const data = await api<ModuleDetails>(`/admin/modules/${id}`);
            setModule(data);
            setTitle(data.title);
            setDescription(data.description || "");
            setStatus(data.status);
            setCompletionType(data.completionType);
            setLocalModulesLessons([...data.lessons].sort((a, b) => a.order - b.order));

            const lessonsList = await api<{ items: LessonInfo[] }>("/admin/lessons/search", {
                method: "POST", body: JSON.stringify({ page: 1, pageSize: 200 })
            });
            setAllLessons(lessonsList.items);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    function handleAddLesson() {
        if (!selectedLessonId) return;
        const target = allLessons.find(l => l.id === selectedLessonId);
        if (!target) return;
        if (localLessons.some(l => l.lessonId === selectedLessonId)) return;

        setLocalModulesLessons([...localLessons, { lessonId: selectedLessonId, order: localLessons.length + 1, lesson: target }]);
        setSelectedModuleLessonId("");
    }

    async function handleSave() {
        setSaving(true);
        setMsg("");
        try {
            // 1. Сохраняем поля модуля
            await api(`/admin/modules/${id}`, {
                method: "PUT",
                body: JSON.stringify({ title, description, status, completionType })
            });

            // 2. Сохраняем состав уроков
            const payload = localLessons.map(l => ({ lessonId: l.lessonId, order: l.order }));
            await api(`/admin/modules/${id}/lessons`, {
                method: "PUT",
                body: JSON.stringify({ lessons: payload })
            });

            setMsg("Данные модуля и состав уроков сохранены!");
            loadData();
        } catch (err: any) {
            setMsg(err.message || "Ошибка при сохранении");
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="p-8">Загрузка данных учебного модуля...</div>;
    if (!module) return <div className="p-8">Модуль не найден</div>;

    return (
        <div className="space-y-6 max-w-5xl">
            <div>
                <Button variant="ghost" asChild className="mb-4 rounded-xl"><Link href="/admin/modules"><ArrowLeft className="mr-2 h-4 w-4"/>Назад к списку</Link></Button>
                <h1 className="text-3xl font-semibold text-zinc-950">Редактирование модуля: {module.title}</h1>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    {/* Параметры */}
                    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold">Свойства модуля</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-semibold text-zinc-600">Название</label>
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full h-10 border border-zinc-200 rounded-xl px-3 mt-1 text-sm outline-none"/>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-zinc-600">Описание</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full border border-zinc-200 rounded-xl p-3 mt-1 text-sm outline-none"/>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-zinc-600">Статус публикации</label>
                                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full h-10 border border-zinc-200 rounded-xl px-3 mt-1 text-sm bg-white">
                                        <option value="DRAFT">Черновик (DRAFT)</option>
                                        <option value="ACTIVE">Активен (ACTIVE)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-zinc-600">Условие завершения</label>
                                    <select value={completionType} onChange={(e) => setCompletionType(e.target.value)} className="w-full h-10 border border-zinc-200 rounded-xl px-3 mt-1 text-sm bg-white">
                                        <option value="MANUAL">Вручную (Ознакомление)</option>
                                        <option value="TEST">По финальному тесту</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Состав уроков */}
                    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold">Уроки внутри модуля ({localLessons.length})</h2>
                        <div className="flex gap-2">
                            <select value={selectedLessonId} onChange={(e) => setSelectedModuleLessonId(e.target.value)} className="h-10 flex-1 border border-zinc-200 rounded-xl px-3 text-xs bg-white outline-none">
                                <option value="">-- Привязать существующий урок --</option>
                                {allLessons.filter(al => !localLessons.some(ll => ll.lessonId === al.id)).map(l => (
                                    <option key={l.id} value={l.id}>{l.title}</option>
                                ))}
                            </select>
                            <Button onClick={handleAddLesson} disabled={!selectedLessonId} className="h-10 rounded-xl px-4"><Plus className="mr-1 h-3.5 w-3.5"/>Добавить</Button>
                        </div>

                        <div className="space-y-2">
                            {localLessons.map((item, idx) => (
                                <div key={item.lessonId} className="flex items-center justify-between p-3 border border-zinc-200 rounded-xl bg-zinc-50/50">
                                    <span className="text-xs font-bold text-zinc-500 mr-2">#{idx+1}</span>
                                    <span className="text-sm font-medium flex-1 truncate">{item.lesson.title}</span>
                                    <div className="flex items-center gap-1">
                                        <Button size="icon" variant="ghost" disabled={idx===0} onClick={() => {
                                            const list = [...localLessons]; const tmp = list[idx]; list[idx] = list[idx-1]; list[idx-1] = tmp;
                                            setLocalModulesLessons(list.map((l, i) => ({...l, order: i+1})));
                                        }} className="h-8 w-8"><ArrowUp className="h-3.5 w-3.5"/></Button>
                                        <Button size="icon" variant="ghost" disabled={idx===localLessons.length-1} onClick={() => {
                                            const list = [...localLessons]; const tmp = list[idx]; list[idx] = list[idx+1]; list[idx+1] = tmp;
                                            setLocalModulesLessons(list.map((l, i) => ({...l, order: i+1})));
                                        }} className="h-8 w-8"><ArrowDown className="h-3.5 w-3.5"/></Button>
                                        <Button size="icon" variant="ghost" onClick={() => setLocalModulesLessons(localLessons.filter(l => l.lessonId !== item.lessonId).map((l, i) => ({...l, order: i+1})))} className="h-8 w-8 text-red-500"><Trash2 className="h-3.5 w-3.5"/></Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* В каких курсах участвует */}
                <div className="space-y-6">
                    <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-3">
                        <h3 className="font-semibold text-sm text-zinc-900">Входит в программы курсов ({module.courses.length})</h3>
                        <div className="space-y-2">
                            {module.courses.length === 0 ? (
                                <p className="text-xs text-zinc-400">Этот модуль пока свободный и не включен ни в один курс.</p>
                            ) : (
                                module.courses.map(c => (
                                    <div key={c.course.id} className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-xs font-semibold text-zinc-800">
                                        {c.course.title}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {msg && <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl text-sm border border-emerald-200 max-w-3xl">{msg}</div>}

            <div className="flex justify-end gap-3 border-t pt-4 max-w-3xl">
                <Button onClick={handleSave} disabled={saving} className="rounded-xl h-11 px-6">Сохранить модуль и уроки</Button>
            </div>
        </div>
    );
}
