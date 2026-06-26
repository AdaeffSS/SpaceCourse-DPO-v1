"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

type Props = {
    open: boolean;
    onClose: () => void;
    onCreated: () => Promise<void>;
};

export function CreateModuleModal({ open, onClose, onCreated }: Props) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!open) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await api("/admin/modules", {
                method: "POST",
                body: JSON.stringify({ title, description }),
            });
            await onCreated();
            setTitle("");
            setDescription("");
            onClose();
        } catch (err: any) {
            setError(err.message || "Ошибка создания модуля");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
                <h2 className="text-2xl font-semibold text-zinc-950">Создать модуль</h2>
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div>
                        <label className="text-sm font-medium text-zinc-900">Название</label>
                        <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-zinc-200 px-4 outline-none"/>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-zinc-900">Описание</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-2 w-full rounded-xl border border-zinc-200 p-3 outline-none"/>
                    </div>
                    {error && <div className="text-sm text-red-600">{error}</div>}
                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" className="rounded-xl" onClick={onClose}>Отмена</Button>
                        <Button type="submit" className="rounded-xl" disabled={loading}>Создать</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
