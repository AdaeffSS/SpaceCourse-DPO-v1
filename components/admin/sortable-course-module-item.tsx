"use client";

import Link from "next/link";

import {
    ArrowUp,
    ArrowDown,
    Eye,
    Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
    module: {
        moduleId: string;

        module: {
            title: string;
            description: string | null;
        };
    };

    index: number;

    isFirst: boolean;
    isLast: boolean;

    onMoveUp: () => void;
    onMoveDown: () => void;

    onRemove: (
        moduleId: string
    ) => void;
};

export function SortableCourseModuleItem({
                                             module,
                                             index,
                                             isFirst,
                                             isLast,
                                             onMoveUp,
                                             onMoveDown,
                                             onRemove,
                                         }: Props) {
    return (
        <div
            className="
                rounded-3xl
                border border-zinc-200
                bg-white
                p-6
                transition
                hover:border-zinc-300
            "
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="text-sm text-zinc-500">
                        Модуль №{index + 1}
                    </div>

                    <h2 className="mt-1 text-lg font-semibold text-zinc-950">
                        {module.module.title}
                    </h2>

                    {module.module.description && (
                        <p className="mt-2 text-sm text-zinc-600">
                            {module.module.description}
                        </p>
                    )}
                </div>

                <div className="flex gap-2">
                    <Button
                        size="icon"
                        variant="outline"
                        disabled={isFirst}
                        onClick={onMoveUp}
                    >
                        <ArrowUp className="h-4 w-4" />
                    </Button>

                    <Button
                        size="icon"
                        variant="outline"
                        disabled={isLast}
                        onClick={onMoveDown}
                    >
                        <ArrowDown className="h-4 w-4" />
                    </Button>

                    <Link
                        href={`/admin/modules/${module.moduleId}`}
                    >
                        <Button
                            size="icon"
                            variant="outline"
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                    </Link>

                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                            onRemove(
                                module.moduleId
                            )
                        }
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}