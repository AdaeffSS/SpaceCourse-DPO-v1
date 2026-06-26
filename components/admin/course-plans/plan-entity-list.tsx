"use client";

import { Trash2, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EntityList } from "@/components/shared/entity-list/entity-list";
import { EntityListColumn } from "@/components/shared/entity-list/types";
import { CoursePlan } from "@/types/course-plan";

type Props = {
    plans: CoursePlan[];
    loading: boolean;
    selectedIds: string[];
    onSelectionChange: (ids: string[]) => void;
    onDelete: (id: string) => void;
    onRowClick?: (plan: CoursePlan) => void;
};

const columns: EntityListColumn<CoursePlan>[] = [
    {
        key: "type",
        title: "Тип",
        width: "100px",
        render: (item) => (
            <Badge className={item.type === "ATC" ? "bg-purple-50 text-purple-700 border border-purple-200" : "bg-blue-50 text-blue-700 border border-blue-200"}>
                {item.type}
            </Badge>
        ),
    },
    {
        key: "hours",
        title: "Объем плана",
        width: "1fr",
        render: (item) => <span className="font-semibold text-zinc-950">{item.hours} академических часов</span>,
    },
    {
        key: "durationDays",
        title: "Срок",
        width: "150px",
        render: (item) => `${item.durationDays} дней`,
    },
    {
        key: "price",
        title: "Стоимость",
        width: "150px",
        render: (item) => `${item.price.toLocaleString("ru-RU")} ₽`,
    },
];

export function CoursePlansEntityList({ plans, loading, selectedIds, onSelectionChange, onDelete, onRowClick }: Props) {
    return (
        <EntityList
            loading={loading}
            data={plans}
            columns={columns}
            selectable
            selectedIds={selectedIds}
            onSelectionChange={onSelectionChange}
            getRowId={(item) => item.id}
            onRowClick={onRowClick}
            actions={[
                {
                    key: "edit",
                    render: (plan) => (
                        <Button size="icon" variant="outline" onClick={() => onRowClick?.(plan)}>
                            <Pencil className="h-4 w-4" />
                        </Button>
                    ),
                },
                {
                    key: "delete",
                    render: (plan) => (
                        <Button size="icon" variant="outline" className="text-red-600" onClick={() => onDelete(plan.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    ),
                },
            ]}
        />
    );
}
