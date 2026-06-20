"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    Download,
    Search,
    Trash2,
    Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { FileItem } from "@/types/file";

type SelectedMap = Record<string, boolean>;

function getFileType(fileName: string) {
    const ext = fileName
        .split(".")
        .pop()
        ?.toUpperCase();

    return ext || "FILE";
}

function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} Б`;

    if (bytes < 1024 * 1024)
        return `${(bytes / 1024).toFixed(1)} КБ`;

    if (bytes < 1024 * 1024 * 1024)
        return `${(bytes / 1024 / 1024).toFixed(1)} МБ`;

    return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} ГБ`;
}

export function FilesPage() {
    const [files, setFiles] =
        useState<FileItem[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [uploading, setUploading] =
        useState(false);

    const [uploadProgress, setUploadProgress] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [selected, setSelected] =
        useState<SelectedMap>({});

    const fileInputRef =
        useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadFiles();
    }, [search]);

    async function loadFiles() {
        try {
            setLoading(true);

            const params =
                new URLSearchParams();

            if (search) {
                params.append("search", search);
            }

            const data = await api<FileItem[]>(
                `/files?${params.toString()}`
            );

            setFiles(data);
            setSelected({});
        } finally {
            setLoading(false);
        }
    }

    function toggleSelect(id: string) {
        setSelected((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    }

    function selectAll() {
        const map: SelectedMap = {};

        files.forEach((f) => {
            map[f.id] = true;
        });

        setSelected(map);
    }

    function clearSelection() {
        setSelected({});
    }

    const selectedIds = Object.keys(selected).filter(
        (id) => selected[id]
    );

    async function deleteSelected() {
        if (!selectedIds.length) return;

        if (
            !confirm(
                `Удалить ${selectedIds.length} файлов?`
            )
        )
            return;

        await api("/files", {
            method: "DELETE",
            body: JSON.stringify({
                ids: selectedIds,
            }),
        });

        await loadFiles();
    }

    async function deleteOne(id: string) {
        if (!confirm("Удалить файл?")) return;

        await api(`/files/${id}`, {
            method: "DELETE",
        });

        await loadFiles();
    }

    async function downloadFile(id: string, name: string) {
        const token = document.cookie
            .split("; ")
            .find((r) => r.startsWith("token="))
            ?.split("=")[1];

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/files/${id}/download`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const blob = await res.blob();

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = name;

        document.body.appendChild(a);
        a.click();
        a.remove();

        URL.revokeObjectURL(url);
    }

    async function uploadFiles(fileList: FileList) {
        try {
            setUploading(true);

            const files = Array.from(fileList);

            for (let i = 0; i < files.length; i++) {
                setUploadProgress(
                    `Загрузка ${i + 1} из ${files.length}`
                );

                const form = new FormData();
                form.append("file", files[i]);

                await api("/files", {
                    method: "POST",
                    body: form,
                });
            }

            setUploadProgress("");
            await loadFiles();
        } finally {
            setUploading(false);
        }
    }

    function onDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();

        if (e.dataTransfer.files.length) {
            uploadFiles(e.dataTransfer.files);
        }
    }

    const allSelected =
        files.length > 0 &&
        selectedIds.length === files.length;

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex items-start justify-between">
                <h1 className="text-4xl font-semibold">
                    Файлы
                </h1>

                {selectedIds.length > 0 && (
                    <Button
                        variant="destructive"
                        onClick={deleteSelected}
                    >
                        Удалить ({selectedIds.length})
                    </Button>
                )}
            </div>

            {/* DROPZONE */}
            <div
                onClick={() =>
                    fileInputRef.current?.click()
                }
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                className="
                    cursor-pointer
                    rounded-2xl
                    border-2 border-dashed border-zinc-300
                    bg-white
                    p-10
                    text-center
                    transition-colors
                    hover:bg-zinc-50
                "
            >
                <Upload className="mx-auto mb-2" />

                Перетащите файлы сюда или нажмите

                {uploading && (
                    <div className="mt-2 text-sm text-zinc-500">
                        {uploadProgress}
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                multiple
                hidden
                onChange={(e) => {
                    if (e.target.files) {
                        uploadFiles(e.target.files);
                    }
                }}
            />

            {/* SEARCH */}
            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4" />

                <input
                    className="
                        h-11
                        w-full
                        rounded-xl
                        border border-zinc-200
                        pl-10 pr-4
                    "
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    placeholder="Поиск файлов"
                />
            </div>

            {/* TABLE */}
            <div
                className="
                    overflow-hidden
                    rounded-2xl
                    border border-zinc-200
                    bg-white
                    shadow-sm
                "
            >
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="bg-zinc-50">
                        <th className="border px-2 py-2">
                            <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={(e) =>
                                    e.target.checked
                                        ? selectAll()
                                        : clearSelection()
                                }
                            />
                        </th>

                        <th className="border px-2 py-2 text-left">
                            Файл
                        </th>

                        <th className="border px-2 py-2 text-left">
                            Размер
                        </th>

                        <th className="border px-2 py-2 text-left">
                            Используется
                        </th>

                        <th className="border px-2 py-2 text-left">
                            Действия
                        </th>
                    </tr>
                    </thead>

                    <tbody>
                    {loading ? (
                        <tr>
                            <td
                                colSpan={5}
                                className="p-4 text-center"
                            >
                                Загрузка...
                            </td>
                        </tr>
                    ) : (
                        files.map((file) => (
                            <tr
                                key={file.id}
                                className="hover:bg-zinc-50"
                            >
                                <td className="border px-2 py-2">
                                    <input
                                        type="checkbox"
                                        checked={
                                            !!selected[file.id]
                                        }
                                        onChange={() =>
                                            toggleSelect(file.id)
                                        }
                                    />
                                </td>

                                <td className="border px-2 py-2">
                                    <div className="flex items-center">
                                            <span className="inline-flex items-center rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-700">
                                                {getFileType(
                                                    file.originalName
                                                )}
                                            </span>

                                        <span className="ml-2">
                                                {
                                                    file.originalName
                                                }
                                            </span>
                                    </div>
                                </td>

                                <td className="border px-2 py-2">
                                    {formatSize(
                                        file.sizeBytes
                                    )}
                                </td>

                                <td className="border px-2 py-2">
                                    {file.lessonsCount}
                                </td>

                                <td className="border px-2 py-2">
                                    <div className="flex gap-2">
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() =>
                                                downloadFile(
                                                    file.id,
                                                    file.originalName
                                                )
                                            }
                                        >
                                            <Download className="w-4 h-4" />
                                        </Button>

                                        <Button
                                            size="icon"
                                            variant="outline"
                                            disabled={
                                                file.lessonsCount > 0
                                            }
                                            onClick={() =>
                                                deleteOne(file.id)
                                            }
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}