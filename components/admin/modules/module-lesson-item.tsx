"use client";

import Link from "next/link";

import {
    ArrowDown,
    ArrowUp,
    Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { ModuleLesson } from "@/types/module-lesson";

type Props = {
    lesson: ModuleLesson;

    index: number;

    isFirst: boolean;
    isLast: boolean;

    onMoveUp: () => void;
    onMoveDown: () => void;

    onRemove: (
        lessonId: string
    ) => void;
};

export function ModuleLessonItem({
                                             lesson,
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
            "
        >
            <div className="flex items-start justify-between">
                <div>
                    <div className="text-sm text-zinc-500">
                        Урок №{index + 1}
                    </div>

                    <h2 className="mt-1 text-lg font-semibold text-zinc-950">
                        {lesson.lesson.title}
                    </h2>
                </div>

                <div className="flex gap-2">
                    <Link
                        href={`/admin/lessons/${lesson.lesson.id}`}
                    >
                        <Button variant="outline">
                            Открыть
                        </Button>
                    </Link>

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

                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                            onRemove(
                                lesson.lessonId
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