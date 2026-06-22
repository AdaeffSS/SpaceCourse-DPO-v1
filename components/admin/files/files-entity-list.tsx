"use client";

import {Download, Pencil, Trash2} from "lucide-react";

import { FileItem } from "@/types/file";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { EntityList } from "@/components/shared/entity-list/entity-list";
import { EntityListColumn } from "@/components/shared/entity-list/types";

type Props = {
    files: FileItem[];

    loading: boolean;

    selectedIds: string[];

    sortField: keyof FileItem;

    sortOrder: "asc" | "desc";

    onSelectionChange: (
        ids: string[],
    ) => void;

    onSort: (
        field: keyof FileItem,
    ) => void;

    onDownload: (
        id: string,
        name: string,
    ) => void;

    onDelete: (
        id: string,
    ) => void;
};

const columns: EntityListColumn<FileItem>[] = [
    {
        key: "mimeType",
        title: "Тип",

        sortable: true,

        width: "52px",

        headerClassName:
            "flex justify-center",

        cellClassName:
            "flex justify-center",

        render: (item) => {
            const extension =
                item.originalName
                    .split(".")
                    .pop()
                    ?.toUpperCase() ?? "FILE";

            const styles = {
                PDF: "border-red-200 bg-red-50 text-red-700",
                DOCX: "border-blue-200 bg-blue-50 text-blue-700",
                PNG: "border-emerald-200 bg-emerald-50 text-emerald-700",
            };

            return (
                <Badge
                    className={`
            border
            font-medium
            shadow-none
            ${
                        styles[
                            extension as keyof typeof styles
                            ] ??
                        "border-zinc-200 bg-zinc-50 text-zinc-700"
                    }
          `}
                >
                    {extension}
                </Badge>
            );
        },
    },

    {
        key: "originalName",
        title: "Название",

        sortable: true,

        width: "1fr",

        cellClassName: "min-w-0",

        render: (item) => (
            <div className="truncate text-sm font-medium">
                {item.originalName}
            </div>
        ),
    },

    {
        key: "sizeBytes",
        title: "Размер",

        sortable: true,

        width: "90px",

        headerClassName:
            "flex justify-center",

        cellClassName:
            "text-center text-sm text-zinc-500",

        render: (item) =>
            `${(
                item.sizeBytes /
                1024 /
                1024
            ).toFixed(1)} MB`,
    },

    {
        key: "lessonsCount",
        title: "Использование",

        sortable: true,

        width: "140px",

        headerClassName:
            "flex justify-center",

        cellClassName:
            "text-center text-sm text-zinc-500",

        render: (item) =>
            `${item.lessonsCount} уроков`,
    },

    {
        key: "createdAt",
        title: "Дата",

        sortable: true,

        width: "100px",

        headerClassName:
            "flex justify-center",

        cellClassName:
            "text-center text-sm text-zinc-500",

        render: (item) =>
            new Date(
                item.createdAt,
            ).toLocaleDateString(
                "ru-RU",
            ),
    },
];

export function FilesEntityList({
                                    files,
                                    loading,

                                    selectedIds,

                                    sortField,
                                    sortOrder,

                                    onSelectionChange,
                                    onSort,

                                    onDownload,
                                    onDelete,
                                }: Props) {
    return (
        <EntityList
            loading={loading}
            data={files}
            columns={columns}
            selectable
            selectedIds={selectedIds}
            onSelectionChange={
                onSelectionChange
            }
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={onSort}
            getRowId={(item) =>
                item.id
            }
            actions={[
                {
                    key: "download",

                    render: (file) => (
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                                onDownload(
                                    file.id,
                                    file.originalName,
                                )
                            }
                        >
                            <Download className="h-4 w-4" />
                        </Button>
                    ),
                },

                {
                    key: "delete",

                    render: (file) => (
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                                onDelete(file.id)
                            }
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    ),
                },
            ]}
        />
    );
}