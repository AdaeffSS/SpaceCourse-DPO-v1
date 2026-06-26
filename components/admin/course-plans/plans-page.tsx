"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { SearchResult } from "@/types/api/search-result";
import { CoursePlan } from "@/types/course-plan";

import { EntityBrowserPagination } from "@/components/shared/entity-browser/entity-browser-pagination";
import { CoursePlansEntityList } from "./plan-entity-list";
import { CreatePlanModal } from "./modals/create-plan-modal";
import { EditPlanModal } from "./modals/edit-plan-modal";

export function CoursePlansPage() {
    const [plans, setPlans] = useState<CoursePlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<CoursePlan | null>(null);

    const [type, setType] = useState("");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    useEffect(() => {
        loadPlans();
    }, [page, type]);

    async function loadPlans() {
        try {
            setLoading(true);
            setError("");

            const filters: Record<string, string[]> = {};
            if (type) filters.type = [type];

            const result = await api<SearchResult<CoursePlan>>("/admin/course-plans/search", {
                method: "POST",
                body: JSON.stringify({
                    page,
                    pageSize: 20,
                    sortField: "createdAt",
                    sortOrder: "desc",
                    filters,
                }),
            });

            setPlans(result.items);
            setTotal(result.meta.total);
            setTotalPages(result.meta.totalPages);
            setSelectedIds([]);
        } catch (err: any) {
            setError(err.message || "Не удалось загрузить планы курсов");
        } finally {
            setLoading(false);
        }
    }

    async function deleteOne(id: string) {
        if (!confirm("Удалить этот тарифный план?")) return;
        try {
            await api(`/admin/course-plans/${id}`, { method: "DELETE" });
            await loadPlans();
        } catch (err: any) {
            alert(err.message || "Ошибка при удалении плана.");
        }
    }

    async function deleteSelected() {
        if (!selectedIds.length) return;
        if (!confirm(`Удалить выбранные планы (${selectedIds.length} шт.)?`)) return;
        try {
            await api("/admin/course-plans", {
                method: "DELETE",
                body: JSON.stringify({ ids: selectedIds }),
            });
            await loadPlans();
        } catch (err: any) {
            alert(err.message || "Ошибка при массовом удалении.");
        }
    }

    function handleRowAction(plan: CoursePlan) {
        setSelectedPlan(plan);
        setEditOpen(true);
    }

    return (
        <>
            <CreatePlanModal 
                open={createOpen} 
                onClose={() => setCreateOpen(false)} 
                onCreated={async () => { await loadPlans(); }} 
            />

            <EditPlanModal
                plan={selectedPlan}
                open={editOpen}
                onClose={() => { setEditOpen(false); setSelectedPlan(null); }}
                onUpdated={async () => { await loadPlans(); }}
            />

            <div className="space-y-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">Планы программ</h1>
                        <p className="text-base text-zinc-600">Управление абстрактными тарифами, академическими часами и длительностью обучения</p>
                    </div>
                    <Button className="h-11 rounded-xl px-5" onClick={() => setCreateOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Создать план
                    </Button>
                </div>

                <div className="flex max-w-xs">
                    <select value={type} onChange={(e) => { setPage(1); setType(e.target.value); }} className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-medium text-zinc-700 outline-none transition-colors hover:bg-zinc-100">
                        <option value="">Все типы программ</option>
                        <option value="ATC">Повышение квалификации (ATC)</option>
                        <option value="PRP">Переподготовка (PRP)</option>
                    </select>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-zinc-600">
                        <span>Всего планов: <strong>{total}</strong></span>
                        {selectedIds.length > 0 && (
                            <>
                                <span className="text-zinc-400">•</span>
                                <span className="text-blue-600">Выбрано: <strong>{selectedIds.length}</strong></span>
                            </>
                        )}
                    </div>
                    {selectedIds.length > 0 && (
                        <Button variant="destructive" onClick={deleteSelected}>
                            <Trash2 className="mr-2 h-4 w-4" /> Удалить выбранные
                        </Button>
                    )}
                </div>

                {error && <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">{error}</div>}

                {!loading && !error && plans.length === 0 && (
                    <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center">
                        <h2 className="text-lg font-semibold text-zinc-950">Планы не найдены</h2>
                        <p className="mt-2 text-zinc-600">Добавьте первый универсальный тарифный план для образовательных программ.</p>
                    </div>
                )}

                {(plans.length > 0 || loading) && (
                    <CoursePlansEntityList
                        plans={plans}
                        loading={loading}
                        selectedIds={selectedIds}
                        onSelectionChange={setSelectedIds}
                        onDelete={deleteOne}
                        onRowClick={handleRowAction}
                    />
                )}

                {totalPages > 1 && (
                    <EntityBrowserPagination page={page} totalPages={totalPages} onPageChange={setPage} />
                )}
            </div>
        </>
    );
}
