import { PlayCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function TestIntro() {
    return (
        <Card>
            <CardContent className="p-6 md:p-8">
                <h1 className="text-3xl font-semibold">
                    Итоговое тестирование курса
                </h1>

                <p className="mt-3 text-zinc-600">
                    Методика преподавания выбранной дисциплины в организациях СОО и ООО
                </p>

                <div className="mt-6 grid gap-3 md:grid-cols-4">
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                        <p className="text-sm text-zinc-500">
                            Вопросов
                        </p>

                        <p className="mt-1 text-2xl font-semibold">
                            10
                        </p>
                    </div>

                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                        <p className="text-sm text-zinc-500">
                            Проходной балл
                        </p>

                        <p className="mt-1 text-2xl font-semibold">
                            7
                        </p>
                    </div>

                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                        <p className="text-sm text-zinc-500">
                            Ограничение по времени
                        </p>

                        <p className="mt-1 text-2xl font-semibold">
                            Нет
                        </p>
                    </div>

                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                        <p className="text-sm text-zinc-500">
                            Попытки
                        </p>

                        <p className="mt-1 text-2xl font-semibold">
                            ∞
                        </p>
                    </div>
                </div>

                <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">
                    <h2 className="font-medium text-blue-900">
                        Инструкция
                    </h2>

                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-blue-900">
                        <li>
                            После выбора ответа нажмите кнопку «Ответить».
                        </li>

                        <li>
                            Система сразу покажет правильность ответа.
                        </li>

                        <li>
                            Тест автоматически завершается после набора проходного балла.
                        </li>

                        <li>
                            Если количество ошибок превысит допустимое значение,
                            Вам будет предложено пройти тест повторно.
                        </li>

                        <li>
                            Количество попыток прохождения не ограничено.
                        </li>
                    </ul>
                </div>

                <div className="mt-6">
                    <Button
                        variant="outline"
                        className="h-11 rounded-xl px-5"
                    >
                        <PlayCircle className="h-4 w-4" />
                        Начать тестирование
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}