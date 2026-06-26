"use client";

import { Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EntityList } from "@/components/shared/entity-list/entity-list";
import { EntityListColumn } from "@/components/shared/entity-list/types";

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

type Props = {
    files: FileItem[];
    loading: boolean;
    selectedIds: string[];
    onSelectionChange: (ids: string[]) => void;
    onDelete: (id: string) => void;
};

const columns: EntityListColumn<FileItem>[] = [
    {
        key: "originalName",
        title: "Название файла",
        width: "45%",
        render: (item) => (
            <div className="w-full relative h-[40px] min-w-0">
                <div className="absolute inset-0 flex flex-col justify-center min-w-0 pr-2">
                    <span className="font-medium text-zinc-950 text-sm block truncate w-full" title={item.originalName}>
                        {item.originalName}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono mt-0.5 uppercase tracking-wider block truncate w-full">
                        {item.mimeType}
                    </span>
                </div>
            </div>
        ),
    },
    {
        key: "sizeBytes",
        title: "Размер",
        width: "15%",
        render: (item) => (
            <span className="text-xs font-medium text-zinc-600 whitespace-nowrap">
                {(item.sizeBytes / 1024 / 1024).toFixed(2)} МБ
            </span>
        ),
    },
    {
        key: "lessonFiles",
        title: "Используется в уроках",
        width: "20%",
        render: (item) => {
            const count = item.lessonFiles?.length || 0;
            return (
                <span className={`text-sm font-medium whitespace-nowrap ${count > 0 ? "text-blue-600 font-semibold" : "text-zinc-400"}`}>
                    {count} уроков
                </span>
            );
        },
    },
    {
        key: "createdAt",
        title: "Загружен",
        width: "20%",
        render: (item) => (
            <span className="text-xs text-zinc-500 whitespace-nowrap">
                {new Date(item.createdAt).toLocaleDateString("ru-RU")}
            </span>
        ),
    },
];

export function FilesEntityList({ files, loading, selectedIds, onSelectionChange, onDelete }: Props) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    return (
        <EntityList
            loading={loading}
            data={files}
            columns={columns}
            selectable
            selectedIds={selectedIds}
            onSelectionChange={onSelectionChange}
            getRowId={(item) => item.id}
            actions={[
                {
                    key: "download",
                    render: (item) => (
                        <Button size="icon" variant="outline" asChild className="h-9 w-9 rounded-lg shrink-0">
                            <a href={`${API_URL}/admin/files/${item.id}/download`} download target="_blank" rel="noreferrer">
                                <Download className="h-4 w-4 text-zinc-600" />
                            </a>
                        </Button>
                    ),
                },
                {
                    key: "delete",
                    render: (item) => {
                        const isAttached = item.lessonFiles && item.lessonFiles.length > 0;
                        return (
                            <Button 
                                size="icon" 
                                variant="outline" 
                                disabled={isAttached}
                                className={`h-9 w-9 rounded-lg shrink-0 transition-colors ${
                                    isAttached 
                                        ? "text-zinc-300 bg-zinc-50 border-zinc-200 cursor-not-allowed" 
                                        : "text-red-500 hover:text-red-600 hover:bg-red-50"
                                    }`}
                                title={isAttached ? "Нельзя удалить файл, так как он привязан к урокам" : "Удалить файл"}
                                onClick={() => onDelete(item.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        );
                    },
                },
            ]}
        />
    );
}
