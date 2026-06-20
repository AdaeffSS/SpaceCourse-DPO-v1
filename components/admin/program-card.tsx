"use client";

import Link from "next/link";

import { Course } from "@/types/course";

type Props = {
    course: Course;
};

export function ProgramCard({
                                course,
                            }: Props) {
    return (
        <Link
            href={`/admin/courses/${course.id}`}
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
                        {course.title}
                    </h2>

                    {course.description && (
                        <p className="mt-2 text-sm text-zinc-600">
                            {course.description}
                        </p>
                    )}
                </div>

                <span
                    className={
                        course.isPublished
                            ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                            : "rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700"
                    }
                >
                    {course.isPublished
                        ? "Опубликована"
                        : "Черновик"}
                </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-zinc-500">
                        Тип программы
                    </p>

                    <p className="mt-1 font-medium text-zinc-900">
                        {course.type}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-zinc-500">
                        Стоимость
                    </p>

                    <p className="mt-1 font-medium text-zinc-900">
                        {course.plan.price.toLocaleString("ru-RU")} ₽
                    </p>
                </div>

                <div>
                    <p className="text-sm text-zinc-500">
                        Объём
                    </p>

                    <p className="mt-1 font-medium text-zinc-900">
                        {course.plan.hours} ч.
                    </p>
                </div>

                <div>
                    <p className="text-sm text-zinc-500">
                        Продолжительность
                    </p>

                    <p className="mt-1 font-medium text-zinc-900">
                        {course.plan.durationDays} дн.
                    </p>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-zinc-500">
                        Стоимость
                    </p>

                    <p className="mt-1 font-medium text-zinc-900">
                        {course.plan.price.toLocaleString("ru-RU")} ₽
                    </p>
                </div>

                <div>
                    <p className="text-sm text-zinc-500">
                        Объём
                    </p>

                    <p className="mt-1 font-medium text-zinc-900">
                        {course.plan.hours} ч.
                    </p>
                </div>

                <div>
                    <p className="text-sm text-zinc-500">
                        Модулей
                    </p>

                    <p className="mt-1 font-medium text-zinc-900">
                        {course._count.modules}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-zinc-500">
                        Слушателей
                    </p>

                    <p className="mt-1 font-medium text-zinc-900">
                        {course._count.enrollments}
                    </p>
                </div>
            </div>
        </Link>
    );
}