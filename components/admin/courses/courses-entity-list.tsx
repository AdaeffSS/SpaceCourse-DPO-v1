"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Course } from "@/types/course";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EntityList } from "@/components/shared/entity-list/entity-list";
import { EntityListColumn } from "@/components/shared/entity-list/types";

type Props = {
    courses: Course[];
    loading: boolean;
    selectedIds: string[];
    sortField: keyof Course;
    sortOrder: "asc" | "desc";
    onSelectionChange: (ids: string[]) => void;
    onSort: (field: any) => void;
    onDelete: (id: string) => void;
    onEdit?: (id: string) => void;
    onRowClick?: (course: Course) => void;
};

const columns: EntityListColumn<Course>[] = [
    {
        key: "type",
        title: "Тип",
        sortable: true,
        width: "80px",
        headerClassName: "flex justify-center",
        cellClassName: "flex justify-center",
        render: (item) => {
            const styles = {
                ATC: "border-purple-200 bg-purple-50 text-purple-700",
                PRP: "border-blue-200 bg-blue-50 text-blue-700",
            };

            return (
                <Badge
                    className={`border font-medium shadow-none ${
                    styles[item.type as keyof typeof styles] ??
                    "border-zinc-200 bg-zinc-50 text-zinc-700"
                }`}
        >
            {item.type}
            </Badge>
        );
        },
    },
    {
        key: "title",
        title: "Название курса",
        sortable: true,
        width: "1fr",
        cellClassName: "min-w-0",
        render: (item) => (
            <div className="truncate text-sm font-medium text-zinc-950">
                {item.title}
                </div>
        ),
    },
    {
        key: "isPublished",
        title: "Статус",
        sortable: true,
        width: "130px",
        headerClassName: "flex justify-center",
        cellClassName: "flex justify-center",
        render: (item) => (
            <Badge
                variant={item.isPublished ? "default" : "secondary"}
        className={`font-medium shadow-none ${
            item.isPublished
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
                : "border-zinc-200 bg-zinc-100 text-zinc-600 hover:bg-zinc-100"
        }`}
    >
    {item.isPublished ? "Опубликован" : "Черновик"}
    </Badge>
),
},
{
    key: "modulesCount",
        title: "Модули",
    sortable: true,
    width: "100px",
    headerClassName: "flex justify-center",
    cellClassName: "text-center text-sm text-zinc-500",
    render: (item) => `${item.modulesCount ?? 0} шт.`,
},
{
    key: "enrollmentsCount",
        title: "Студенты",
    sortable: true,
    width: "110px",
    headerClassName: "flex justify-center",
    cellClassName: "text-center text-sm text-zinc-500",
    render: (item) => `${item.enrollmentsCount ?? 0} чел.`,
},
{
    key: "createdAt",
        title: "Создан",
    sortable: true,
    width: "110px",
    headerClassName: "flex justify-center",
    cellClassName: "text-center text-sm text-zinc-500",
    render: (item) => new Date(item.createdAt).toLocaleDateString("ru-RU"),
},
];

export function CoursesEntityList({
                                      courses,
                                      loading,
                                      selectedIds,
                                      sortField,
                                      sortOrder,
                                      onSelectionChange,
                                      onSort,
                                      onDelete,
                                      onEdit,
                                      onRowClick,
                                  }: Props) {
    return (
        <EntityList
            loading={loading}
    data={courses}
    columns={columns}
    selectable
    selectedIds={selectedIds}
    onSelectionChange={onSelectionChange}
    sortField={sortField}
    sortOrder={sortOrder}
    onSort={onSort}
    getRowId={(item) => item.id}
    onRowClick={onRowClick}
    actions={[
        ...(onEdit
            ? [
                {
                    key: "edit",
                    render: (course: Course) => (
                        <Button
                            size="icon"
                    variant="outline"
                    onClick={() => onEdit(course.id)}
>
    <Pencil className="h-4 w-4" />
        </Button>
),
},
]
: []),
    {
        key: "delete",
            render: (course: Course) => (
        <Button
            size="icon"
        variant="outline"
        className="text-red-600 hover:text-red-700"
        onClick={() => onDelete(course.id)}
    >
        <Trash2 className="h-4 w-4" />
            </Button>
    ),
    },
]}
    />
);
}
