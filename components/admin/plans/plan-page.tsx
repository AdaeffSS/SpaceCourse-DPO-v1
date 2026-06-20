"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

import { CoursePlanDetails } from "@/types/course-plan";

type Props = {
    id: string;
};

export function PlanPage({
                             id,
                         }: Props) {
    const router = useRouter();

    const [plan, setPlan] =
        useState<CoursePlanDetails | null>(
            null
        );

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [price, setPrice] =
        useState("");

    const [hours, setHours] =
        useState("");

    const [durationDays, setDurationDays] =
        useState("");

    useEffect(() => {
        loadPlan();
    }, [id]);

    async function loadPlan() {
        try {
            const data =
                await api<CoursePlanDetails>(
                    `/course-plans/${id}`
                );

            setPlan(data);

            setPrice(
                String(data.price)
            );

            setHours(
                String(data.hours)
            );

            setDurationDays(
                String(data.durationDays)
            );
        } finally {
            setLoading(false);
        }
    }

    async function save() {
        setSaving(true);

        try {
            await api(
                `/course-plans/${id}`,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        price: Number(price),
                        hours: Number(hours),
                        durationDays:
                            Number(durationDays),
                    }),
                }
            );

            router.push("/admin/plans");
            router.refresh();
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div>
                Загрузка...
            </div>
        );
    }

    if (!plan) {
        return (
            <div>
                План не найден
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="space-y-3">
                <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">
                    План программы
                </h1>

                <p className="max-w-2xl text-base text-zinc-600">
                    Настройка параметров
                    образовательных программ.
                </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-8">
                <div className="space-y-6">
                    <div>
                        <label className="text-sm font-medium text-zinc-900">
                            Стоимость
                        </label>

                        <input
                            type="number"
                            value={price}
                            onChange={(e) =>
                                setPrice(
                                    e.target.value
                                )
                            }
                            className="
                                mt-2 h-11 w-full
                                rounded-xl border
                                border-zinc-200
                                px-4 outline-none
                            "
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-zinc-900">
                            Часы
                        </label>

                        <input
                            type="number"
                            value={hours}
                            onChange={(e) =>
                                setHours(
                                    e.target.value
                                )
                            }
                            className="
                                mt-2 h-11 w-full
                                rounded-xl border
                                border-zinc-200
                                px-4 outline-none
                            "
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-zinc-900">
                            Продолжительность
                        </label>

                        <input
                            type="number"
                            value={durationDays}
                            onChange={(e) =>
                                setDurationDays(
                                    e.target.value
                                )
                            }
                            className="
                                mt-2 h-11 w-full
                                rounded-xl border
                                border-zinc-200
                                px-4 outline-none
                            "
                        />
                    </div>

                    <Button
                        onClick={save}
                        disabled={saving}
                        className="rounded-xl"
                    >
                        {saving
                            ? "Сохранение..."
                            : "Сохранить"}
                    </Button>
                </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-8">
                <h2 className="text-xl font-semibold text-zinc-950">
                    Программы плана
                </h2>

                <div className="mt-6 space-y-3">
                    {plan.courses.map(
                        (course) => (
                            <div
                                key={
                                    course.id
                                }
                                className="
                                    rounded-2xl
                                    border
                                    border-zinc-200
                                    p-4
                                "
                            >
                                {
                                    course.title
                                }
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}