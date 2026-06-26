"use client";

import { Trash2, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EntityList } from "@/components/shared/entity-list/entity-list";
import { EntityListColumn } from "@/components/shared/entity-list/types";

type ModuleItem = {
    id: string;
    title: string;
    status: string;
    completionType: string;
    createdAt: string;
};

type Props = {
    modules: ModuleItem[];
    loading: boolean;
    selectedIds: string[];
    onSelectionChange: (ids: string[]) => void;
    onDelete: (id: string) => void;
    onRowClick?: (module: ModuleItem) => void;
};

const columns: EntityListColumn<ModuleItem>[] = [
    {
        key: "title",
        title: "Название модуля",
        width: "1fr",
        render: (item) => <span className="font-medium text-zinc-950 text-sm">{item.title}</span>,
    },
    {
        key: "status",
        title: "Статус",
        width: "120px",
        render: (item) => (
            <Badge variant={item.status === "ACTIVE" ? "default" : "secondary"}>
                {item.status === "ACTIVE" ? "Активен" : "Черновик"}
            </Badge>
        ),
    },
    {
        key: "completionType",
        title: "Завершение",
        width: "150px",
        render: (item) => item.completionType === "TEST" ? "По тесту" : "Вручную",
    },
    {
        key: "createdAt",
        title: "Создан",
        width: "120px",
        render: (item) => new Date(item.createdAt).toLocaleDateString("ru-RU"),
    },
];

export function ModulesEntityList({ modules, loading, selectedIds, onSelectionChange, onDelete, onRowClick }: Props) {
    return (
        <EntityList
            loading={loading}
            data={modules}
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
