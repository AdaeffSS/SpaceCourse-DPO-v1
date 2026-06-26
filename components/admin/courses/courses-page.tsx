"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

import { Course } from "@/types/course";
import { CoursePlan } from "@/types/course-plan";
import { SearchResult } from "@/types/api/search-result";

import { CreateCourseModal } from "@/components/admin/courses/modals/create-course-modal";
import { useDebounce } from "@/hooks/use-debounce";
import { CoursesEntityList } from "./courses-entity-list";

import { SearchInput } from "@/components/shared/search-input/search-input";
import { EntityBrowserPagination } from "@/components/shared/entity-browser/entity-browser-pagination";

export function CoursesPage() {
    const router = useRouter();
    const [courses, setCourses] = useState<Course[]>([]);
    const [plans, setPlans] = useState<CoursePlan[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [createOpen, setCreateOpen] = useState(false);

    const [search, setSearch] = useState("");
    const [type, setType] = useState("");
    const [isPublished, setIsPublished] = useState("");
    const [planId, setPlanId] = useState("");

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const [sortField, setSortField] = useState<keyof Course>("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        loadCourses();
    }, [page, debouncedSearch, type, isPublished, planId, sortField, sortOrder]);

    async function loadCourses() {
        try {
            setLoading(true);
            setError("");

            const filters: Record<string, string[]> = {};
            if (type) filters.type = [type];
            if (planId) filters.planId = [planId];
            if (isPublished) filters.isPublished = [isPublished];

            const result = await api<SearchResult<Course>>("/admin/courses/search", {
                method: "POST",
                body: JSON.stringify({
                    page,
                    pageSize: 20,
                    search: debouncedSearch,
                    sortField,
                    sortOrder,
                    filters,
                }),
            });

            setCourses(result.items);
            setTotal(result.meta.total);
            setTotalPages(result.meta.totalPages);
            setSelectedIds([]);
        } catch (err: any) {
            setError(err.message || "Не удалось загрузить данные");
        } finally {
            setLoading(false);
        }
    }

    function toggleSort(field: keyof Course) {
        setPage(1);
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
            return;
        }
        setSortField(field);
        setSortOrder("desc");
    }

    async function deleteOne(id: string) {
        if (!confirm("Удалить этот курс?")) {
            return;
        }

        try {
            await api(`/admin/courses/${id}`, {
                method: "DELETE",
            });
            await loadCourses();
        } catch (err: any) {
            alert(err.message || "Ошибка при удалении курса");
        }
    }

    async function deleteSelected() {
        if (!selectedIds.length) return;

        if (!confirm(`Удалить выбранные курсы (${selectedIds.length} шт.)?`)) {
            return;
        }

        try {
            await api("/admin/courses", {
                method: "DELETE",
                body: JSON.stringify({
                    ids: selectedIds,
                }),
            });
            await loadCourses();
        } catch (err: any) {
            alert(err.message || "Ошибка при удалении курсов");
        }
    }

    function handleResetFilters() {
        setSearch("");
        setType("");
        setIsPublished("");
        setPlanId("");
        setPage(1);
    }

    return (
        <>
            <CreateCourseModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onCreated={loadCourses}
                plans={plans}
            />

            <div className="space-y-6">
                {/* Хедер */}
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">
                            Курсы
                        </h1>
                        <p className="text-base text-zinc-600">
                            Управление образовательными программами
                        </p>
                    </div>

                    <Button
                        className="h-11 rounded-xl px-5"
                        onClick={() => setCreateOpen(true)}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Создать курс
                    </Button>
                </div>

                {/* Панель фильтров */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                    <div className="grid gap-4 lg:grid-cols-4">
                        <SearchInput
                            placeholder="Поиск курса..."
                            onChange={(value) => {
                                setPage(1);
                                setSearch(value);
                            }}
                        />

                        <select
                            value={type}
                            onChange={(e) => {
                                setPage(1);
                                setType(e.target.value);
                            }}
                            className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-medium text-zinc-700 outline-none transition-colors hover:bg-zinc-100"
                        >
                            <option value="">Все типы</option>
                            <option value="ATC">ATC</option>
                            <option value="PRP">PRP</option>
                        </select>

                        <select
                            value={isPublished}
                            onChange={(e) => {
                                setPage(1);
                                setIsPublished(e.target.value);
                            }}
                            className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-medium text-zinc-700 outline-none transition-colors hover:bg-zinc-100"
                        >
                            <option value="">Все статусы</option>
                            <option value="true">Опубликованные</option>
                            <option value="false">Черновики</option>
                        </select>

                        <select
                            value={planId}
                            onChange={(e) => {
                                setPage(1);
                                setPlanId(e.target.value);
                            }}
                            className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-medium text-zinc-700 outline-none transition-colors hover:bg-zinc-100"
                        >
                            <option value="">Все plans</option>
                            {plans.map((plan) => (
                                <option key={plan.id} value={plan.id}>
                                    {plan.hours} ч. / {plan.price} ₽
                                </option>
                            ))}
                        </select>
                    </div>

                    {(search || type || isPublished || planId) && (
                        <div className="mt-4">
                            <Button variant="outline" size="sm" onClick={handleResetFilters}>
                                Сбросить фильтры
                            </Button>
                        </div>
                    )}
                </div>

                {/* Инфо-панель сверху таблицы */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-zinc-600">
            <span>
              Всего программ: <strong>{total}</strong>
            </span>
                        {selectedIds.length > 0 && (
                            <>
                                <span className="text-zinc-400">•</span>
                                <span className="text-blue-600">
                  Выбрано: <strong>{selectedIds.length}</strong>
                </span>
                            </>
                        )}
                    </div>

                    {selectedIds.length > 0 && (
                        <Button variant="destructive" onClick={deleteSelected}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Удалить выбранные
                        </Button>
                    )}
                </div>

                {/* Состояние Ошибки */}
                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">
                        {error}
                    </div>
                )}

                {/* Пустая таблица */}
                {!loading && !error && courses.length === 0 && (
                    <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center">
                        <h2 className="text-lg font-semibold text-zinc-950">
                            Курсы не найдены
                        </h2>
                        <p className="mt-2 text-zinc-600">
                            Попробуйте изменить параметры фильтрации или создайте новый курс.
                        </p>
                    </div>
                )}

                {/* Сетка / Компонент Списка */}
                {(courses.length > 0 || loading) && (
                    <CoursesEntityList
                        courses={courses}
                        loading={loading}
                        selectedIds={selectedIds}
                        sortField={sortField}
                        sortOrder={sortOrder}
                        onSelectionChange={setSelectedIds}
                        onSort={toggleSort}
                        onDelete={deleteOne}
                        onEdit={(id) => router.push(`/admin/courses/${id}`)}
                        onRowClick={(course) => router.push(`/admin/courses/${course.id}`)}
                    />
                )}

                {/* Пагинация */}
                {totalPages > 1 && (
                    <EntityBrowserPagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                )}
            </div>
        </>
    );
}
