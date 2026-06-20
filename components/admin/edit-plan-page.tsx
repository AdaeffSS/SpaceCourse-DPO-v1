"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";

export function EditPlanPage() {
    const [price, setPrice] = useState("5000");
    const [hours, setHours] = useState("72");
    const [durationDays, setDurationDays] = useState("30");

    const [loading, setLoading] = useState(false);

    async function onSubmit(
        e: React.FormEvent
    ) {
        e.preventDefault();

        setLoading(true);

        try {
            // TODO: PUT /course-plans/:id
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-8">
            <div className="space-y-3">
                <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">
                    Редактирование плана
                </h1>

                <p className="max-w-2xl text-base text-zinc-600">
                    Изменение параметров плана образовательной программы.
                </p>
            </div>

            <form
                onSubmit={onSubmit}
                className="
                    max-w-3xl
                    rounded-3xl
                    border border-zinc-200
                    bg-white
                    p-8
                "
            >
                <div className="space-y-6">
                    <div>
                        <label className="text-sm font-medium text-zinc-900">
                            Стоимость
                        </label>

                        <input
                            type="number"
                            value={price}
                            onChange={(e) =>
                                setPrice(e.target.value)
                            }
                            className="
                                mt-2
                                h-11
                                w-full
                                rounded-xl
                                border border-zinc-200
                                px-4
                                outline-none
                                transition
                                focus:border-zinc-900
                            "
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-zinc-900">
                            Количество часов
                        </label>

                        <input
                            type="number"
                            value={hours}
                            onChange={(e) =>
                                setHours(e.target.value)
                            }
                            className="
                                mt-2
                                h-11
                                w-full
                                rounded-xl
                                border border-zinc-200
                                px-4
                                outline-none
                                transition
                                focus:border-zinc-900
                            "
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-zinc-900">
                            Продолжительность (дней)
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
                                mt-2
                                h-11
                                w-full
                                rounded-xl
                                border border-zinc-200
                                px-4
                                outline-none
                                transition
                                focus:border-zinc-900
                            "
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="h-11 rounded-xl"
                    >
                        {loading
                            ? "Сохранение..."
                            : "Сохранить"}
                    </Button>
                </div>
            </form>
        </div>
    );
}