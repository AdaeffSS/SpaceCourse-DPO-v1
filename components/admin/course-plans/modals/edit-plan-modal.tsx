"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { CoursePlan } from "@/types/course-plan";

type Props = {
    plan: CoursePlan | null;
    open: boolean;
    onClose: () => void;
    onUpdated: () => Promise<void>;
};

export function EditPlanModal({ plan, open, onClose, onUpdated }: Props) {
    const [price, setPrice] = useState("");
    const [hours, setHours] = useState("");
    const [durationDays, setDurationDays] = useState("");
    const [type, setType] = useState("ATC");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (open && plan) {
            setPrice(String(plan.price));
            setHours(String(plan.hours));
            setDurationDays(String(plan.durationDays));
            setType(plan.type);
            setError("");
        }
    }, [open, plan]);

    if (!open || !plan) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await api(`/admin/course-plans/${plan.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    price: Number(price),
                    hours: Number(hours),
                    durationDays: Number(durationDays),
                    type,
                }),
            });
            await onUpdated();
            onClose();
        } catch (err: any) {
            setError(err.message || "Ошибка обновления плана");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
                <h2 className="text-2xl font-semibold text-zinc-950">Редактировать шаблон плана</h2>
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div>
                        <label className="text-sm font-medium text-zinc-900">Тип программы</label>
                        <select value={type} onChange={(e) => setType(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-zinc-200 px-4 bg-white outline-none">
                            <option value="ATC">ATC (Повышение квалификации)</option>
                            <option value="PRP">PRP (Переподготовка)</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-zinc-900">Объем академических часов</label>
                        <input type="number" required min="1" value={hours} onChange={(e) => setHours(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-zinc-200 px-4 outline-none"/>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-zinc-900">Срок прохождения (дней)</label>
                        <input type="number" required min="1" value={durationDays} onChange={(e) => setDurationDays(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-zinc-200 px-4 outline-none"/>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-zinc-900">Стоимость (₽)</label>
                        <input type="number" required min="0" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-zinc-200 px-4 outline-none"/>
                    </div>
                    {error && <div className="text-sm text-red-600">{error}</div>}
                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" className="rounded-xl" onClick={onClose}>Отмена</Button>
                        <Button type="submit" className="rounded-xl" disabled={loading}>Сохранить</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
