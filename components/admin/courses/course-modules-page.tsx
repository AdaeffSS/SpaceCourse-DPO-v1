"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Trash2, Plus, ArrowUp, ArrowDown, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { CoursePlan, CoursePlanRelationDetails } from "@/types/course-plan";

type ModuleInfo = {
    id: string;
    title: string;
};

type CourseModuleRelation = {
    moduleId: string;
    order: number;
    module: ModuleInfo;
};

type CourseDetails = {
    id: string;
    title: string;
    modules: CourseModuleRelation[];
    plans: { plan: CoursePlan; testHours: number }[];
};

export function CourseModulesPage({ id }: { id: string }) {
    const [course, setCourse] = useState<CourseDetails | null>(null);
    const [allPlans, setAllPlans] = useState<CoursePlan[]>([]);
    const [allModules, setAllModules] = useState<ModuleInfo[]>([]);
    const [activeTab, setActiveTab] = useState<"structure" | "hours">("structure");
    
    const [selectedModuleId, setSelectedModuleId] = useState("");
    const [newModuleTitle, setNewModuleTitle] = useState("");
    const [localModules, setLocalModules] = useState<CourseModuleRelation[]>([]);
    
    const [selectedPlanId, setSelectedPlanId] = useState<string>("");
    const [testHours, setTestHours] = useState<number>(0);
    const [hoursMap, setHoursMap] = useState<Record<string, number>>({});
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ text: "", isError: false });

    useEffect(() => {
        loadInitialData();
    }, [id]);

    useEffect(() => {
        if (selectedPlanId) {
            loadPlanHours(selectedPlanId);
        }
    }, [selectedPlanId]);

    async function loadInitialData() {
        try {
            setLoading(true);
            const courseData = await api<CourseDetails>(`/admin/courses/${id}`);
            setCourse(courseData);
            setLocalModules([...courseData.modules].sort((a, b) => a.order - b.order));
            
            const plansData = await api<{ items: CoursePlan[] }>("/admin/course-plans/search", {
                method: "POST", body: JSON.stringify({ page: 1, pageSize: 100 })
            });
            setAllPlans(plansData.items);

            const modulesData = await api<{ items: ModuleInfo[] }>("/admin/modules/search", {
                method: "POST", body: JSON.stringify({ page: 1, pageSize: 100 })
            });
            setAllModules(modulesData.items);

            if (courseData.plans.length > 0 && !selectedPlanId) {
                setSelectedPlanId(courseData.plans[0].plan.id);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function loadPlanHours(planId: string) {
        try {
            const data = await api<CoursePlanRelationDetails>(`/admin/courses/${id}/plans/${planId}/hours`);
            setTestHours(data.testHours);
            const hours: Record<string, number> = {};
            data.moduleHours.forEach((mh) => {
                hours[mh.moduleId] = mh.durationValue;
            });
            setHoursMap(hours);
        } catch (err) {
            setHoursMap({});
            setTestHours(0);
        }
    }

    async function handleCreateAndAddModule() {
        if (!newModuleTitle.trim()) return;
        setSaving(true);
        try {
            const createdModule = await api<ModuleInfo>("/admin/modules", {
                method: "POST",
                body: JSON.stringify({ title: newModuleTitle.trim(), description: "" })
            });

            const newRelation: CourseModuleRelation = {
                moduleId: createdModule.id,
                order: localModules.length + 1,
                module: createdModule
            };

            setLocalModules([...localModules, newRelation]);
            setNewModuleTitle("");
            
            const modulesData = await api<{ items: ModuleInfo[] }>("/admin/modules/search", {
                method: "POST", body: JSON.stringify({ page: 1, pageSize: 100 })
            });
            setAllModules(modulesData.items);
        } catch (err: any) {
            alert(err.message || "Ошибка создания модуля");
        } finally {
            setSaving(false);
        }
    }

    function handleAddModule() {
        if (!selectedModuleId) return;
        const targetModule = allModules.find(m => m.id === selectedModuleId);
        if (!targetModule) return;

        if (localModules.some(m => m.moduleId === selectedModuleId)) {
            alert("Этот модуль уже добавлен в курс");
            return;
        }

        const newRelation: CourseModuleRelation = {
            moduleId: selectedModuleId,
            order: localModules.length + 1,
            module: targetModule
        };

        setLocalModules([...localModules, newRelation]);
        setSelectedModuleId("");
    }

    function handleRemoveModule(moduleId: string) {
        const filtered = localModules.filter(m => m.moduleId !== moduleId);
        const reordered = filtered.map((m, idx) => ({ ...m, order: idx + 1 }));
        setLocalModules(reordered);
    }

    function moveModule(index: number, direction: "up" | "down") {
        if (direction === "up" && index === 0) return;
        if (direction === "down" && index === localModules.length - 1) return;

        const targetIndex = direction === "up" ? index - 1 : index + 1;
        const list = [...localModules];
        
        const temp = list[index];
        list[index] = list[targetIndex];
        list[targetIndex] = temp;

        const reordered = list.map((m, idx) => ({ ...m, order: idx + 1 }));
        setLocalModules(reordered);
    }

    async function saveStructure() {
        setSaving(true);
        setMessage({ text: "", isError: false });
        try {
            const payload = localModules.map(m => ({ moduleId: m.moduleId, order: m.order }));
            await api(`/admin/courses/${id}/modules`, {
                method: "PUT",
                body: JSON.stringify({ modules: payload })
            });
            setMessage({ text: "Структура контента курса успешно сохранена!", isError: false });
            await loadInitialData();
        } catch (err: any) {
            setMessage({ text: err.message || "Ошибка сохранения структуры", isError: true });
        } finally {
            setSaving(false);
        }
    }

    async function handleAttachPlan(planId: string) {
        if (!planId) return;
        try {
            await api(`/admin/courses/${id}/plans`, { method: "POST", body: JSON.stringify({ planId }) });
            await loadInitialData();
            setSelectedPlanId(planId);
        } catch (err: any) {
            alert(err.message);
        }
    }

    async function handleDetachPlan(planId: string) {
        if (!confirm("Отвязать этот plan от курса?")) return;
        try {
            await api(`/admin/courses/${id}/plans/${planId}`, { method: "DELETE" });
            await loadInitialData();
        } catch (err: any) {
            alert(err.message);
        }
    }

    async function saveHours() {
        setSaving(true);
        setMessage({ text: "", isError: false });

        const payload = course?.modules.map((m) => ({
            moduleId: m.moduleId,
            durationValue: hoursMap[m.moduleId] || 0
        })) || [];

        try {
            await api(`/admin/courses/${id}/plans/hours`, {
                method: "PUT",
                body: JSON.stringify({ planId: selectedPlanId, testHours: Number(testHours), moduleHours: payload })
            });
            setMessage({ text: "Юридическая ведомость часов успешно сохранена и валидирована!", isError: false });
        } catch (err: any) {
            setMessage({ text: err.message || "Ошибка сохранения часов", isError: true });
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="p-8">Загрузка конфигуратора...</div>;
    if (!course) return <div className="p-8">Курс не найден</div>;

    const currentPlanObj = course.plans.find((p) => p.plan.id === selectedPlanId)?.plan;
    const currentModulesSum = course.modules.reduce((sum, m) => sum + (hoursMap[m.moduleId] || 0), 0);
    const currentTotalSum = currentModulesSum + Number(testHours);
    const availableModulesForSelection = allModules.filter(am => !localModules.some(lm => lm.moduleId === am.id));

    return (
        <div className="space-y-6">
            <div>
                <Button variant="ghost" asChild className="mb-4 rounded-xl"><Link href={`/admin/courses/${id}`}><ArrowLeft className="mr-2 h-4 w-4"/>Назад к курсу</Link></Button>
                <h1 className="text-3xl font-semibold text-zinc-950">Конфигуратор: {course.title}</h1>
            </div>

            <div className="flex border-b border-zinc-200 gap-6">
                <button onClick={() => { setActiveTab("structure"); setMessage({text:"", isError:false}); }} className={`pb-3 font-medium text-sm ${activeTab === "structure" ? "border-b-2 border-zinc-900 text-zinc-950" : "text-zinc-500"}`}>Структура модулей</button>
                <button onClick={() => { setActiveTab("hours"); setMessage({text:"", isError:false}); }} className={`pb-3 font-medium text-sm ${activeTab === "hours" ? "border-b-2 border-zinc-900 text-zinc-950" : "text-zinc-500"}`}>Юридические ведомости часов</button>
            </div>

            {activeTab === "structure" ? (
                <div className="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm max-w-3xl space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold text-zinc-950">Управление контентным скелетом</h2>
                        <p className="text-sm text-zinc-500 mt-1">Вы можете как привязать уже существующий модуль, так и создать абсолютно новый на лету.</p>
                    </div>

                    <div className="flex gap-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-200">
                        <input type="text" placeholder="Введите название нового модуля для создания..." value={newModuleTitle} onChange={(e) => setNewModuleTitle(e.target.value)} className="h-11 flex-1 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-blue-500 transition-colors"/>
                        <Button onClick={handleCreateAndAddModule} disabled={saving || !newModuleTitle.trim()} className="h-11 bg-blue-600 hover:bg-blue-700 rounded-xl px-4 text-white"><Plus className="mr-1.5 h-4 w-4"/>Создать и внедрить</Button>
                    </div>

                    <div className="flex gap-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
                        <select value={selectedModuleId} onChange={(e) => setSelectedModuleId(e.target.value)} className="h-11 flex-1 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none">
                            <option value="">-- Выберите существующий в системе модуль --</option>
                            {availableModulesForSelection.map(m => (
                                <option key={m.id} value={m.id}>{m.title}</option>
                            ))}
                        </select>
                        <Button variant="outline" onClick={handleAddModule} disabled={!selectedModuleId} className="h-11 rounded-xl px-4"><Plus className="mr-1.5 h-4 w-4"/> Привязать</Button>
                    </div>

                    <div className="space-y-2.5">
                        {localModules.length === 0 ? (
                            <p className="text-sm text-zinc-500 text-center py-6 border border-dashed border-zinc-200 rounded-2xl">В этот курс еще не добавлено ни одного контентного модуля.</p>
                        ) : (
                            localModules.map((item, idx) => (
                                <div key={item.moduleId} className="flex items-center justify-between p-4 bg-white border border-zinc-200 rounded-xl hover:border-zinc-300 transition-colors shadow-2xs">
                                    <span className="text-sm font-medium text-zinc-900 font-mono bg-zinc-100 border border-zinc-200 h-7 px-2 flex items-center justify-center rounded-lg mr-3 shrink-0">{item.order}</span>
                                    <span className="text-sm font-medium text-zinc-950 flex-1 truncate pr-4">{item.module.title}</span>
                                    
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <Button size="icon" variant="ghost" disabled={idx === 0} onClick={() => moveModule(idx, "up")} className="h-9 w-9 rounded-lg"><ArrowUp className="h-4 w-4"/></Button>
                                        <Button size="icon" variant="ghost" disabled={idx === localModules.length - 1} onClick={() => moveModule(idx, "down")} className="h-9 w-9 rounded-lg"><ArrowDown className="h-4 w-4"/></Button>
                                        <Button size="icon" variant="ghost" onClick={() => handleRemoveModule(item.moduleId)} className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="h-4 w-4"/></Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {message.text && (
                        <div className={`p-4 rounded-xl text-sm border ${message.isError ? "bg-red-50 text-red-600 border-red-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"}`}>{message.text}</div>
                    )}

                    <div className="pt-4 border-t border-zinc-100 flex justify-end">
                        <Button onClick={saveStructure} disabled={saving} className="h-11 rounded-xl px-6"><Check className="mr-2 h-4 w-4"/> Сохранить структуру курса</Button>
                    </div>
                </div>
            ) : (
                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm space-y-5">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Распределение нагрузки</h2>
                                {currentPlanObj && (
                                    <div className={`text-xs px-3 py-1.5 rounded-full font-bold border ${currentTotalSum === currentPlanObj.hours ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                                        Баланс: {currentTotalSum} / {currentPlanObj.hours} ак. ч.
                                    </div>
                                )}
                            </div>

                            {selectedPlanId ? (
                                <div className="space-y-4">
                                    {course.modules.length === 0 ? (
                                        <p className="text-sm text-zinc-400 text-center py-4">Сначала сохраните структуру модулей на первой вкладке, чтобы распределить по ним часы.</p>
                                    ) : (
                                        course.modules.map((m, idx) => (
                                            <div key={m.moduleId} className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
                                                <span className="text-sm font-medium">Модуль {idx + 1}. {m.module.title}</span>
                                                <div className="flex items-center gap-2">
                                                    <input type="number" min="0" value={hoursMap[m.moduleId] ?? ""} onChange={(e) => setHoursMap({...hoursMap, [m.moduleId]: parseInt(e.target.value) || 0})} className="w-20 h-10 border border-zinc-200 bg-white rounded-lg text-center font-bold"/>
                                                    <span className="text-xs text-zinc-400 font-medium">ч.</span>
                                                </div>
                                            </div>
                                        ))
                                    )}

                                    {course.modules.length > 0 && (
                                        <>
                                            <div className="flex items-center justify-between p-4 bg-purple-50/50 border border-purple-200 rounded-xl">
                                                <span className="text-sm font-semibold text-purple-950">Академические часы на Итоговый тест</span>
                                                <div className="flex items-center gap-2">
                                                    <input type="number" min="0" value={testHours} onChange={(e) => setTestHours(parseInt(e.target.value) || 0)} className="w-20 h-10 border border-purple-300 bg-white rounded-lg text-center font-bold text-purple-950 focus:border-purple-600"/>
                                                    <span className="text-xs text-purple-600 font-medium">ч.</span>
                                                </div>
                                            </div>

                                            {message.text && (
                                                <div className={`p-4 rounded-xl text-sm border ${message.isError ? "bg-red-50 text-red-600 border-red-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"}`}>{message.text}</div>
                                            )}

                                            <Button onClick={saveHours} disabled={saving} className="w-full h-11 rounded-xl"><Check className="mr-2 h-4 w-4"/>Сохранить и верифицировать ведомость</Button>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-zinc-400">Привяжите хотя бы один план справа, чтобы расписать часы.</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm space-y-4">
                            <h3 className="font-semibold text-base">Подключенные планы ({course.plans.length})</h3>
                            <div className="space-y-2">
                                {course.plans.map((p) => (
                                    <div key={p.plan.id} onClick={() => setSelectedPlanId(p.plan.id)} className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between ${selectedPlanId === p.plan.id ? "bg-zinc-900 text-white border-zinc-900" : "bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-900"}`}>
                                        <span className="text-xs font-bold">{p.plan.hours} ч. ({p.plan.type})</span>
                                        <button onClick={(e) => { e.stopPropagation(); handleDetachPlan(p.plan.id); }} className="text-red-500 hover:text-red-700 p-1"><Trash2 className="h-3.5 w-3.5"/></button>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-2 border-t border-zinc-100">
                                <label className="text-xs font-medium text-zinc-500">Подключить другой план</label>
                                <select onChange={(e) => { handleAttachPlan(e.target.value); e.target.value = ""; }} className="mt-1.5 h-10 w-full rounded-lg border border-zinc-200 bg-white text-xs px-2">
                                    <option value="">-- Выберите из шаблонов --</option>
                                    {allPlans.filter(ap => !course.plans.some(cp => cp.plan.id === ap.id)).map(p => (
                                        <option key={p.id} value={p.id}>{p.hours} ч. — {p.type} ({p.price} ₽)</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
