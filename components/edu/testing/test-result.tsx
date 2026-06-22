import { Card, CardContent } from "@/components/ui/card";

type TestResultProps = {
    score: number;
    total: number;
};

export function TestResult({
                               score,
                               total,
                           }: TestResultProps) {
    const percent = Math.round((score / total) * 100);

    return (
        <Card>
            <CardContent className="p-8 text-center">
                <div className="text-6xl font-bold text-emerald-600">
                    {percent}%
                </div>

                <p className="mt-4 text-xl font-medium">
                    Результат тестирования
                </p>

                <p className="mt-2 text-zinc-600">
                    Правильных ответов: {score} из {total}
                </p>
            </CardContent>
        </Card>
    );
}