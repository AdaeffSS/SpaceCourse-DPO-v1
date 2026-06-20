"use client";

import Link from "next/link";

import { CoursePlan } from "@/types/course-plan";

type Props = {
    plan: CoursePlan;
};

export function PlanCard({
                             plan,
                         }: Props) {
    return (
        <Link
            href={`/admin/plans/${plan.id}`}
            className="
                rounded-3xl
                border border-zinc-200
                bg-white
                p-6
                transition
                hover:border-zinc-300
            "
        >
            <div>
                <h2 className="text-xl font-semibold text-zinc-950">
                    {plan.hours} часов
                </h2>

                <p className="mt-2 text-sm text-zinc-600">
                    План образовательной программы.
                </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-zinc-500">
                        Стоимость
                    </p>

                    <p className="mt-1 font-medium text-zinc-900">
                        {plan.price.toLocaleString("ru-RU")} ₽
                    </p>
                </div>

                <div>
                    <p className="text-sm text-zinc-500">
                        Часы
                    </p>

                    <p className="mt-1 font-medium text-zinc-900">
                        {plan.hours}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-zinc-500">
                        Продолжительность
                    </p>

                    <p className="mt-1 font-medium text-zinc-900">
                        {plan.durationDays} дней
                    </p>
                </div>

                <div>
                    <p className="text-sm text-zinc-500">
                        Программ
                    </p>

                    <p className="mt-1 font-medium text-zinc-900">
                        {plan.coursesCount}
                    </p>
                </div>
            </div>

            <div className="mt-6 border-t border-zinc-100 pt-4">
                <p className="text-xs text-zinc-500">
                    Создан:{" "}
                    {new Date(
                        plan.createdAt
                    ).toLocaleDateString("ru-RU")}
                </p>
            </div>
        </Link>
    );
}