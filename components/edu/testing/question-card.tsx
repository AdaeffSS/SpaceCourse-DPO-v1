"use client"

import { useState } from "react";

import { AnswerOption } from "./answer-option";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type QuestionCardProps = {
    index: number;
    total: number;
    question: string;
    answers: string[];
};

export function QuestionCard({
                                 index,
                                 total,
                                 question,
                                 answers,
                             }: QuestionCardProps) {
    const [selected, setSelected] = useState<number | null>(null);

    return (
        <Card>
            <CardContent className="p-6">
                <div className="mb-2 text-sm text-zinc-500">
                    Вопрос {index} из {total}
                </div>

                <h2 className="mb-6 text-2xl font-semibold">
                    {question}
                </h2>

                <div className="space-y-3">
                    {answers.map((answer, i) => (
                        <AnswerOption
                            key={i}
                            text={answer}
                            selected={selected === i}
                            onClick={() => setSelected(i)}
                        />
                    ))}
                </div>

                <div className="mt-6">
                    <Button
                        disabled={selected === null}
                        variant="outline"
                        className="h-11 rounded-xl px-5"
                    >
                        Ответить
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}