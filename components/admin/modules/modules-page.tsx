"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { SearchResult } from "@/types/api/search-result";

import { EntityBrowserPagination } from "@/components/shared/entity-browser/entity-browser-pagination";
import { ModulesEntityList } from "./modules-entity-list";
import { CreateModuleModal } from "./modals/create-module-modal";

type ModuleItem = {
    id: string;
    title: string;
    status: string;
    completionType: string;
    createdAt: string;
};

export function ModulesPage() {
    const router = useRouter();
    const [modules, setModules] = useState<ModuleItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [createOpen, setCreateOpen] = useState(false);

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    useEffect(() => {
        loadModules();
    }, [page]);

    async function loadModules() {
        try {
            setLoading(true);
            setError("");

            const result = await api<SearchResult<ModuleItem>>("/admin/modules/search", {
                method: "POST",
                body: JSON.stringify({
                    page,
                    pageSize: 20,
                    sortField: "createdAt",
                    sortOrder: "desc",
                }),
            });

            setModules(result.items);
            setTotal(result.meta.total);
            setTotalPages(result.meta.totalPages);
            setSelectedIds([]);
        } catch (err: any) {
            setError(err.message || "Не удалось загрузить модули");
        } finally {
            setLoading(false);
        }
    }

    async function deleteOne(id: string) {
        if (!confirm("Удалить этот модуль из системы? Это может повлиять на связанные курсы.")) return;
        try {
            await api(`/admin/modules/${id}`, { method: "DELETE" });
            await loadModules();
        } catch (err: any) {
            alert(err.message || "Ошибка при удалении модуля");
        }
    }

    return (
        <>
            <CreateModuleModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onCreated={async () => { await loadModules(); }}
            />

            <div className="space-y-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">Глобальные модули</h1>
                        <p className="text-base text-zinc-600">Библиотека учебных модулей всей платформы</p>
                    </div>
                    <Button className="h-11 rounded-xl px-5" onClick={() => setCreateOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Создать модуль
                    </Button>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-zinc-600">
                        <span>Всего модулей в системе: <strong>{total}</strong></span>
                    </div>
                </div>

                {error && <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">{error}</div>}

                {!loading && !error && modules.length === 0 && (
                    <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center">
                        <h2 className="text-lg font-semibold text-zinc-950">Модули не найдены</h2>
                        <p className="mt-2 text-zinc-600">Создайте первый модуль, чтобы затем использовать его в программах.</p>
                    </div>
                )}

                {(modules.length > 0 || loading) && (
                    <ModulesEntityList
                        modules={modules}
                        loading={loading}
                        selectedIds={selectedIds}
                        onSelectionChange={setSelectedIds}
                        onDelete={deleteOne}
                        onRowClick={(item) => router.push(`/admin/modules/${item.id}`)}
                    />
                )}

                {totalPages > 1 && (
                    <EntityBrowserPagination page={page} totalPages={totalPages} onPageChange={setPage} />
                )}
            </div>
        </>
    );
}
