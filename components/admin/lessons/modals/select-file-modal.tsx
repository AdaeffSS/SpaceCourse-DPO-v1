"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

import { api } from "@/lib/api";

import { FileItem } from "@/types/file";

type Props = {
    open: boolean;

    onClose: () => void;

    selectedIds: string[];

    onSelect: (file: FileItem) => void;
};

export function SelectFileModal({
                                    open,
                                    onClose,
                                    selectedIds,
                                    onSelect,
                                }: Props) {
    const [files, setFiles] = useState<FileItem[]>([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!open) {
            return;
        }

        loadFiles();
    }, [open]);

    async function loadFiles() {
        try {
            setLoading(true);

            const data = await api<FileItem[]>("/files");

            setFiles(data);
        } finally {
            setLoading(false);
        }
    }

    const filteredFiles = useMemo(() => {
        return files.filter((file) =>
            file.originalName
                .toLowerCase()
                .includes(search.toLowerCase()),
        );
    }, [files, search]);

    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
            <div className="flex max-h-[80vh] w-full max-w-4xl flex-col rounded-3xl bg-white">
                <div className="border-b border-zinc-200 p-6">
                    <h2 className="text-2xl font-semibold text-zinc-950">
                        Добавление файлов
                    </h2>

                    <p className="mt-2 text-sm text-zinc-600">
                        Выберите файлы для прикрепления к уроку.
                    </p>

                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Поиск файла..."
                        className="
              mt-4
              h-11
              w-full
              rounded-xl
              border border-zinc-200
              px-4
            "
                    />
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div>Загрузка...</div>
                    ) : (
                        <div className="space-y-4">
                            {filteredFiles.map((file) => {
                                const selected = selectedIds.includes(file.id);

                                return (
                                    <div
                                        key={file.id}
                                        className="
                      rounded-2xl
                      border
                      border-zinc-200
                      p-5
                    "
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="min-w-0">
                                                <h3 className="truncate font-semibold text-zinc-950">
                                                    {file.originalName}
                                                </h3>

                                                <p className="mt-1 text-sm text-zinc-500">
                                                    {file.mimeType}
                                                </p>
                                            </div>

                                            <Button
                                                disabled={selected}
                                                onClick={() => onSelect(file)}
                                            >
                                                {selected ? "Добавлен" : "Добавить"}
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}

                            {filteredFiles.length === 0 && (
                                <div className="rounded-2xl border border-zinc-200 p-8 text-center text-zinc-500">
                                    Ничего не найдено
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="border-t border-zinc-200 p-6">
                    <div className="flex justify-end">
                        <Button
                            variant="outline"
                            onClick={onClose}
                        >
                            Закрыть
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}