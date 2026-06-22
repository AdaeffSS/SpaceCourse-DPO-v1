"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

type Plan = {
    id: string;
    hours: number;
    price: number;
};

type Props = {
    open: boolean;
    onClose: () => void;
    onCreated: () => Promise<void>;
    plans: Plan[];
};

export function CreateCourseModal({
                                       open,
                                       onClose,
                                       onCreated,
                                       plans,
                                   }: Props) {
    const [title, setTitle] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [planId, setPlanId] =
        useState("");

    const [type, setType] =
        useState("ATC");

    const [loading, setLoading] =
        useState(false);

    if (!open) {
        return null;
    }

    async function handleSubmit(
        e: React.FormEvent
    ) {
        e.preventDefault();

        setLoading(true);

        try {
            await api("/courses", {
                method: "POST",
                body: JSON.stringify({
                    title,
                    description,
                    type,
                    planId,
                }),
            });

            await onCreated();

            onClose();
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-xl rounded-3xl bg-white p-8">
                <h2 className="text-2xl font-semibold text-zinc-950">
                    Создать программу
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-5"
                >
                    <div>
                        <label className="text-sm font-medium text-zinc-900">
                            Название
                        </label>

                        <input
                            value={title}
                            onChange={(e) =>
                                setTitle(
                                    e.target.value
                                )
                            }
                            className="mt-2 h-11 w-full rounded-xl border border-zinc-200 px-4"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-zinc-900">
                            Описание
                        </label>

                        <textarea
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                            className="mt-2 w-full rounded-xl border border-zinc-200 p-4"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-zinc-900">
                            План
                        </label>

                        <select
                            value={planId}
                            onChange={(e) =>
                                setPlanId(
                                    e.target.value
                                )
                            }
                            className="mt-2 h-11 w-full rounded-xl border border-zinc-200 px-4"
                        >
                            <option value="">
                                Выберите план
                            </option>

                            {plans.map((plan) => (
                                <option
                                    key={plan.id}
                                    value={plan.id}
                                >
                                    {plan.hours} ч. /{" "}
                                    {plan.price} ₽
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-zinc-900">
                            Тип
                        </label>

                        <select
                            value={type}
                            onChange={(e) =>
                                setType(
                                    e.target.value
                                )
                            }
                            className="mt-2 h-11 w-full rounded-xl border border-zinc-200 px-4"
                        >
                            <option value="ATC">
                                ATC
                            </option>

                            <option value="PRP">
                                PRP
                            </option>
                        </select>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Отмена
                        </Button>

                        <Button
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Создание..."
                                : "Создать"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}