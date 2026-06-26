"use client";

import { useEffect, useState } from "react";
import { X, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

type FileItem = {
    id: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
};

type Props = {
    open: boolean;
    onClose: () => void;
    onSelect: (fileId: string) => void;
};

export function SelectFileModal({ open, onClose, onSelect }: Props) {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (open) {
            loadFiles();
        }
    }, [open]);

    async function loadFiles() {
        try {
            setLoading(true);
            // Бэкенд теперь возвращает прямой массив документов
            const data = await api<FileItem[]>("/admin/files");
            setFiles(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Не удалось загрузить файлы", err);
            setFiles([]);
        } finally {
            setLoading(false);
        }
    }

    if (!open) return null;

    const filteredFiles = files.filter(f => 
        f.originalName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-xl flex flex-col max-h-[80vh]">
                <div className="flex items-center justify-between border-b pb-3">
                    <h2 className="text-xl font-semibold text-zinc-950">Выбрать из существующих файлов</h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl h-9 w-9">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="mt-4">
                    <input
                        type="text"
                        placeholder="Поиск по названию файла..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-11 w-full rounded-xl border border-zinc-200 px-4 text-sm outline-none focus:border-zinc-900 transition-colors"
                    />
                </div>

                <div className="flex-1 overflow-y-auto mt-4 space-y-2 pr-1">
                    {loading ? (
                        <p className="text-sm text-zinc-500 text-center py-4">Загрузка библиотеки файлов...</p>
                    ) : filteredFiles.length === 0 ? (
                        <p className="text-sm text-zinc-400 text-center py-4">Файлы не найдены.</p>
                    ) : (
                        filteredFiles.map((file) => (
                            <div
                                key={file.id}
                                onClick={() => { onSelect(file.id); onClose(); }}
                                className="flex items-center justify-between p-3 border border-zinc-200 rounded-xl hover:bg-zinc-50 cursor-pointer transition-colors"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <FileText className="h-4 w-4 text-zinc-400 shrink-0" />
                                    <span className="text-sm font-medium text-zinc-900 truncate pr-2">{file.originalName}</span>
                                </div>
                                <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold shrink-0">
                                    {(file.sizeBytes / 1024 / 1024).toFixed(2)} MB
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
