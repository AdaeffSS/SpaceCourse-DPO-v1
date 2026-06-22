"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

type Props = {
    open: boolean;
    onClose: () => void;
    onCreated: () => Promise<void>;
};

export function CreatePlanModal({
                                    open,
                                    onClose,
                                    onCreated,
                                }: Props) {
    const [price, setPrice] = useState("");
    const [hours, setHours] = useState("");
    const [durationDays, setDurationDays] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!open) return null;

    async function handleSubmit(
        e: React.FormEvent
    ) {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            await api("/course-plans", {
                method: "POST",
                body: JSON.stringify({
                    price: Number(price),
                    hours: Number(hours),
                    durationDays: Number(durationDays),
                }),
            });

            await onCreated();

            setPrice("");
            setHours("");
            setDurationDays("");

            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className="
                fixed inset-0 z-50
                flex items-center justify-center
                bg-black/40
                p-4
            "
        >
            <div
                className="
                    w-full max-w-lg
                    rounded-3xl
                    border border-zinc-200
                    bg-white
                    p-8
                "
            >
                <h2 className="text-2xl font-semibold text-zinc-950">
                    Создать план
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-5"
                >
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
                                mt-2 h-11 w-full rounded-xl
                                border border-zinc-200
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
                                setHours(e.target.value)
                            }
                            className="
                                mt-2 h-11 w-full rounded-xl
                                border border-zinc-200
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
                                mt-2 h-11 w-full rounded-xl
                                border border-zinc-200
                                px-4 outline-none
                            "
                        />
                    </div>

                    {error && (
                        <div className="text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="rounded-xl"
                            onClick={onClose}
                        >
                            Отмена
                        </Button>

                        <Button
                            type="submit"
                            className="rounded-xl"
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