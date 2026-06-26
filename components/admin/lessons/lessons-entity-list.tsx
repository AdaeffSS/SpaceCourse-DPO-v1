"use client";

import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EntityList } from "@/components/shared/entity-list/entity-list";
import { EntityListColumn } from "@/components/shared/entity-list/types";

type LessonItem = {
    id: string;
    title: string;
    createdAt: string;
};

type Props = {
    lessons: LessonItem[];
    loading: boolean;
    selectedIds: string[];
    onSelectionChange: (ids: string[]) => void;
    onDelete: (id: string) => void;
    onRowClick?: (lesson: LessonItem) => void;
};

const columns: EntityListColumn<LessonItem>[] = [
    {
        key: "title",
        title: "Название урока",
        width: "1fr",
        render: (item) => <span className="font-medium text-zinc-950 text-sm">{item.title}</span>,
    },
    {
        key: "createdAt",
        title: "Дата создания",
        width: "150px",
        render: (item) => new Date(item.createdAt).toLocaleDateString("ru-RU"),
    },
];

export function LessonsEntityList({ lessons, loading, selectedIds, onSelectionChange, onDelete, onRowClick }: Props) {
    return (
        <EntityList
            loading={loading}
            data={lessons}
            columns={columns}
            selectable
            selectedIds={selectedIds}
            onSelectionChange={onSelectionChange}
            getRowId={(item) => item.id}
            onRowClick={onRowClick}
            actions={[
                {
                    key: "edit",
                    render: (item) => (
                        <Button size="icon" variant="outline" onClick={() => onRowClick?.(item)}>
                            <Pencil className="h-4 w-4" />
                        </Button>
                    ),
                },
                {
                    key: "delete",
                    render: (item) => (
                        <Button size="icon" variant="outline" className="text-red-600" onClick={() => onDelete(item.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    ),
                },
            ]}
        />
    );
}
