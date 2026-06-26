"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { SearchResult } from "@/types/api/search-result";
import { SearchInput } from "@/components/shared/search-input/search-input";
import { EntityBrowserPagination } from "@/components/shared/entity-browser/entity-browser-pagination";
import { FilesEntityList } from "./files-entity-list";
import { Button } from "@/components/ui/button";
import { Trash2, UploadCloud, Loader2 } from "lucide-react";

type LessonFileRelation = {
    lessonId: string;
    fileId: string;
};

type FileItem = {
    id: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
    createdAt: string;
    lessonFiles?: LessonFileRelation[];
};

type DeleteResponse = {
    deletedCount: number;
    blockedFiles?: { id: string; originalName: string }[];
};

export function FilesPage() {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [deleteResult, setDeleteResult] = useState<DeleteResponse | null>(null);
    const [msg, setMsg] = useState("");
    const [uploadProgress, setUploadProgress] = useState("");

    useEffect(() => {
        loadFiles();
    }, [page, search]);

    async function loadFiles() {
        try {
            setLoading(true);
            const result = await api<SearchResult<FileItem>>("/admin/files/search", {
                method: "POST",
                body: JSON.stringify({
                    page,
                    pageSize: 20,
                    search: search || undefined,
                    sortField: "createdAt",
                    sortOrder: "desc",
                }),
            });

            setFiles(result.items);
            setTotal(result.meta.total);
            setTotalPages(result.meta.totalPages);
            setSelectedIds([]);
        } catch (err) {
            console.error("Не удалось загрузить список файлов", err);
        } finally {
            setLoading(false);
        }
    }

    async function handleBatchUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || e.target.files.length === 0) return;
        
        const fileList = Array.from(e.target.files);
        setUploading(true);
        setMsg("");
        setDeleteResult(null);

        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];
            setUploadProgress(`Отправка: "${file.name}" (${i + 1} из ${fileList.length})...`);

            const formData = new FormData();
            formData.append("file", file);

            try {
                await api("/admin/files", {
                    method: "POST",
                    body: formData,
                });
                successCount++;
            } catch (err) {
                console.error(err);
                failCount++;
            }
        }

        if (failCount === 0) {
            setMsg(`Успешно загружен пакет файлов в количестве: ${successCount} шт.`);
        } else {
            setMsg(`Загрузка завершена. Успешно: ${successCount}, ошибок: ${failCount}.`);
        }

        setUploading(false);
        setUploadProgress("");
        setPage(1);
        await loadFiles();
    }

    async function deleteOne(id: string) {
        if (!confirm("Удалить этот файл из системы?")) return;
        try {
            await api(`/admin/files/${id}`, { method: "DELETE" });
            setDeleteResult(null);
            setMsg("Файл успешно удален.");
            await loadFiles();
        } catch (err: any) {
            alert(err.message || "Ошибка при удалении файла");
        }
    }

    async function deleteSelected() {
        if (!selectedIds.length) return;
        if (!confirm(`Удалить выбранные файлы (${selectedIds.length} шт.)?`)) return;
        try {
            const res = await api<DeleteResponse>("/admin/files", {
                method: "DELETE",
                body: JSON.stringify({ ids: selectedIds }),
            });
            setDeleteResult(res);
            setMsg("");
            await loadFiles();
        } catch (err: any) {
            alert(err.message || "Ошибка при массовом удалении");
        }
    }

    // Умный перехватчик выбора: исключаем файлы, которые привязаны к урокам, из стейта выделения
    function handleSelectionChange(incomingIds: string[]) {
        const pureSelectableIds = incomingIds.filter((id) => {
            const matchedFile = files.find(f => f.id === id);
            if (!matchedFile) return true;
            const hasLessons = matchedFile.lessonFiles && matchedFile.lessonFiles.length > 0;
            return !hasLessons; // Если уроков нет — файл можно выделить
        });
        setSelectedIds(pureSelectableIds);
    }

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">Библиотека файлов</h1>
                <p className="text-base text-zinc-600">Единое хранилище методических материалов, презентаций и лекционных документов</p>
            </div>

            <div className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-2xs">
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 hover:border-zinc-400 rounded-2xl py-8 px-4 text-center cursor-pointer bg-zinc-50/30 hover:bg-zinc-50 transition-all group">
                    <div className="p-3 bg-white rounded-xl border border-zinc-100 shadow-3xs group-hover:scale-105 transition-transform">
                        {uploading ? (
                            <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                        ) : (
                            <UploadCloud className="h-6 w-6 text-zinc-500" />
                        )}
                    </div>
                    <span className="text-sm font-semibold text-zinc-900 mt-4">
                        {uploading ? "Идет пакетная обработка файлов..." : "Перетащите файлы или нажмите для загрузки"}
                    </span>
                    <span className="text-xs text-zinc-400 mt-1">Вы можете выбрать сразу несколько документов</span>
                    <input type="file" multiple onChange={handleBatchUpload} disabled={uploading} className="hidden" />
                </label>

                {uploading && uploadProgress && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50/60 border border-blue-100 p-3 rounded-xl animate-pulse">
                        <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
                        <span>{uploadProgress}</span>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="w-full sm:max-w-xs">
                    <SearchInput placeholder="Поиск по названию..." value={search} onChange={(val) => { setPage(1); setSearch(val); }} />
                </div>

                {selectedIds.length > 0 && (
                    <Button variant="destructive" className="h-11 rounded-xl px-4 shrink-0" onClick={deleteSelected}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Удалить выбранные ({selectedIds.length})
                    </Button>
                )}
            </div>

            {msg && (
                <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl text-sm border border-emerald-100 shadow-3xs font-medium">
                    {msg}
                </div>
            )}

            {deleteResult && (
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm shadow-2xs space-y-2">
                    <div className="text-emerald-700 font-medium">
                        Успешно удалено файлов: {deleteResult.deletedCount ?? 0} шт.
                    </div>
                    {deleteResult?.blockedFiles && deleteResult.blockedFiles.length > 0 && (
                        <>
                            <div className="mt-3 font-medium text-amber-700">Не удалось удалить следующие файлы (используются в уроках):</div>
                            <ul className="list-disc pl-5 space-y-1 text-zinc-600 mt-1">
                                {deleteResult.blockedFiles.map((f) => (
                                    <li key={f.id}>{f.originalName}</li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            )}

            {!loading && files.length === 0 && (
                <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-12 text-center">
                    <h2 className="text-lg font-semibold text-zinc-950">Файлы не найдены</h2>
                    <p className="mt-1 text-sm text-zinc-500">Загрузите файлы в блоке выше.</p>
                </div>
            )}

            {(files.length > 0 || loading) && (
                <FilesEntityList
                    files={files}
                    loading={loading}
                    selectedIds={selectedIds}
                    onSelectionChange={handleSelectionChange}
                    onDelete={deleteOne}
                />
            )}

            {totalPages > 1 && (
                <EntityBrowserPagination page={page} totalPages={totalPages} onPageChange={setPage} />
            )}
        </div>
    );
}
