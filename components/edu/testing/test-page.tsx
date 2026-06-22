import { QuestionCard } from "./question-card";
import { TestHeader } from "./test-header";
import { TestIntro } from "./test-intro";
import { TestResult } from "./test-result";

const questions = [
    {
        question: "Какого собственно фига?",
        answers: [
            "Такого",
            "Не такого",
            "Что не так?",
        ],
    },
];

// not_started | in_progress | completed
const testStatus = "not_started";

export function TestPage() {
    if (testStatus === "not_started") {
        return <TestIntro />;
    }

    if (testStatus === "completed") {
        return (
            <TestResult
                score={8}
                total={10}
            />
        );
    }

    return (
        <div className="space-y-6">
            <TestHeader
                title="Итоговое тестирование курса"
                totalQuestions={10}
                passingScore={7}
            />

            <QuestionCard
                index={1}
                total={10}
                question={questions[0].question}
                answers={questions[0].answers}
            />
        </div>
    );
}