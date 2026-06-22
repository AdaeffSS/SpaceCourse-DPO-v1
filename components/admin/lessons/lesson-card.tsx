"use client";

import Link from "next/link";

import { Lesson } from "@/types/lesson";

type Props = {
    lesson: Lesson;
};

export function LessonCard({
                               lesson,
                           }: Props) {
    return (
        <Link
            href={`/admin/lessons/${lesson.id}`}
            className="
                rounded-3xl
                border border-zinc-200
                bg-white
                p-6
                transition
                hover:border-zinc-300
            "
        >
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-zinc-950">
                        {lesson.title}
                    </h2>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-zinc-500">
                        Используется в модулях
                    </p>

                    <p className="mt-1 font-medium text-zinc-900">
                        {lesson.modulesCount}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-zinc-500">
                        Создан
                    </p>

                    <p className="mt-1 font-medium text-zinc-900">
                        {new Date(
                            lesson.createdAt
                        ).toLocaleString(
                            "ru-RU"
                        )}
                    </p>
                </div>
            </div>
        </Link>
    );
}