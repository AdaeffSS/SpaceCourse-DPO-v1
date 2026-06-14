import { Card, CardContent } from "@/components/ui/card";

type TestHeaderProps = {
    title: string;
    totalQuestions: number;
    passingScore: number;
};

export function TestHeader({
                               title,
                               totalQuestions,
                               passingScore,
                           }: TestHeaderProps) {
    return (
        <Card>
            <CardContent className="p-6">
                <h1 className="text-3xl font-semibold">
                    {title}
                </h1>

                <div className="mt-6 grid gap-3 md:grid-cols-3">
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                        <p className="text-sm text-zinc-500">
                            Количество вопросов
                        </p>

                        <p className="mt-1 text-2xl font-semibold">
                            {totalQuestions}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                        <p className="text-sm text-zinc-500">
                            Проходной балл
                        </p>

                        <p className="mt-1 text-2xl font-semibold">
                            {passingScore}
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

                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                    После выбора ответа нажмите кнопку «Ответить».
                    Система сразу покажет правильность ответа.
                </div>
            </CardContent>
        </Card>
    );
}