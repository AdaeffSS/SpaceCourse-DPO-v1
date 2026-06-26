"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

type Props = {
    open: boolean;
    onClose: () => void;
    onCreated: () => Promise<void>;
};

export function CreateCourseModal({
                                       open,
                                       onClose,
                                       onCreated,
                                   }: Props) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("ATC");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!open) {
        return null;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await api("/admin/courses", {
                method: "POST",
                body: JSON.stringify({
                    title,
                    description,
                    type,
                }),
            });

            await onCreated();
            setTitle("");
            setDescription("");
            setType("ATC");
            onClose();
        } catch (err: any) {
            setError(err.message || "Ошибка при создании курса");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-xl">
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
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="mt-2 h-11 w-full rounded-xl border border-zinc-200 px-4 outline-none focus:border-zinc-900 transition"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-zinc-900">
                            Описание
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="mt-2 w-full rounded-xl border border-zinc-200 p-4 outline-none focus:border-zinc-900 transition"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-zinc-900">
                            Тип программы
                        </label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 outline-none focus:border-zinc-900 transition"
                        >
                            <option value="ATC">Повышение квалификации (ATC)</option>
                            <option value="PRP">Профессиональная переподготовка (PRP)</option>
                        </select>
                    </div>

                    {error && (
                        <div className="text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="rounded-xl h-11"
                            onClick={onClose}
                        >
                            Отмена
                        </Button>

                        <Button
                            type="submit"
                            className="rounded-xl h-11"
                            disabled={loading || !title.trim()}
                        >
                            {loading ? "Создание..." : "Создать"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
