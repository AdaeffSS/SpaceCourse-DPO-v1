"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

import { Course } from "@/types/course";
import { CoursePlan } from "@/types/course-plan";

import { ProgramCard } from "@/components/admin/program-card";
import { CreateProgramModal } from "@/components/admin/create-program-modal";
import {useDebounce} from "@/hooks/use-debounce";

export function ProgramsPage() {
    const [courses, setCourses] =
        useState<Course[]>([]);

    const [plans, setPlans] =
        useState<CoursePlan[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [createOpen, setCreateOpen] =
        useState(false);

    const [search, setSearch] = useState("");

    const [type, setType] = useState("");

    const [isPublished, setIsPublished] =
        useState("");

    const [planId, setPlanId] =
        useState("");

    const debouncedSearch =
        useDebounce(search, 500);

    useEffect(() => {
        loadData();
    }, [
        debouncedSearch,
        type,
        isPublished,
        planId,
    ]);

    async function loadData() {
        try {
            setError("");

            const params =
                new URLSearchParams();

            if (debouncedSearch) {
                params.append(
                    "search",
                    debouncedSearch
                );
            }

            if (type) {
                params.append(
                    "type",
                    type
                );
            }

            if (isPublished) {
                params.append(
                    "isPublished",
                    isPublished
                );
            }

            if (planId) {
                params.append(
                    "planId",
                    planId
                );
            }

            const [
                coursesData,
                plansData,
            ] = await Promise.all([
                api<Course[]>(
                    `/courses?${params.toString()}`
                ),
                api<CoursePlan[]>(
                    "/course-plans"
                ),
            ]);

            setCourses(coursesData);
            setPlans(plansData);
        } catch (err: any) {
            setError(
                err.message ||
                "Не удалось загрузить данные"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <CreateProgramModal
                open={createOpen}
                onClose={() =>
                    setCreateOpen(false)
                }
                onCreated={loadData}
                plans={plans}
            />

            <div className="space-y-8">
                <div className="flex items-start justify-between">
                    <div className="space-y-3">
                        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">
                            Курсы
                        </h1>

                        <p className="max-w-2xl text-base text-zinc-600">
                            Управление курсами
                        </p>
                    </div>

                    <Button
                        className="h-11 rounded-xl px-5"
                        onClick={() =>
                            setCreateOpen(true)
                        }
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Создать программу
                    </Button>
                </div>

                <div className="rounded-3xl border border-zinc-200 bg-white p-5">
                    <div className="grid gap-4 lg:grid-cols-4">
                        <input
                            placeholder="Поиск программы..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            className="
                h-11 rounded-xl
                border border-zinc-200
                px-4
            "
                        />

                        <select
                            value={type}
                            onChange={(e) =>
                                setType(
                                    e.target.value
                                )
                            }
                            className="
                h-11 rounded-xl
                border border-zinc-200
                px-4
            "
                        >
                            <option value="">
                                Все типы
                            </option>

                            <option value="ATC">
                                ATC
                            </option>

                            <option value="PRP">
                                PRP
                            </option>
                        </select>

                        <select
                            value={isPublished}
                            onChange={(e) =>
                                setIsPublished(
                                    e.target.value
                                )
                            }
                            className="
                h-11 rounded-xl
                border border-zinc-200
                px-4
            "
                        >
                            <option value="">
                                Все статусы
                            </option>

                            <option value="true">
                                Опубликованные
                            </option>

                            <option value="false">
                                Черновики
                            </option>
                        </select>

                        <select
                            value={planId}
                            onChange={(e) =>
                                setPlanId(
                                    e.target.value
                                )
                            }
                            className="
                h-11 rounded-xl
                border border-zinc-200
                px-4
            "
                        >
                            <option value="">
                                Все планы
                            </option>

                            {plans.map((plan) => (
                                <option
                                    key={plan.id}
                                    value={plan.id}
                                >
                                    {plan.hours} ч. /
                                    {plan.price} ₽
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mt-4">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearch("");
                                setType("");
                                setIsPublished("");
                                setPlanId("");
                            }}
                        >
                            Сбросить фильтры
                        </Button>
                    </div>
                </div>

                {loading && (
                    <div className="rounded-3xl border border-zinc-200 bg-white p-6 text-zinc-500">
                        Загрузка...
                    </div>
                )}

                {!loading && error && (
                    <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-600">
                        {error}
                    </div>
                )}

                {!loading &&
                    !error &&
                    courses.length === 0 && (
                        <div className="rounded-3xl border border-zinc-200 bg-white p-10 text-center">
                            <h2 className="text-lg font-semibold text-zinc-950">
                                Пока нет ни одной программы
                            </h2>

                            <p className="mt-2 text-zinc-600">
                                Создайте первую образовательную программу.
                            </p>

                            <Button
                                className="mt-6 rounded-xl"
                                onClick={() =>
                                    setCreateOpen(
                                        true
                                    )
                                }
                            >
                                Создать программу
                            </Button>
                        </div>
                    )}

                {!loading &&
                    !error &&
                    courses.length > 0 && (
                        <div className="grid gap-5 lg:grid-cols-2">
                            {courses.map(
                                (course) => (
                                    <ProgramCard
                                        key={
                                            course.id
                                        }
                                        course={
                                            course
                                        }
                                    />
                                )
                            )}
                        </div>
                    )}
            </div>
        </>
    );
}