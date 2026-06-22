import { cn } from "@/lib/utils";

type AnswerOptionProps = {
    text: string;
    selected?: boolean;
    onClick?: () => void;
};

export function AnswerOption({
                                 text,
                                 selected,
                                 onClick,
                             }: AnswerOptionProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full rounded-2xl border p-4 text-left transition-all",
                "cursor-pointer",
                selected
                    ? "border-blue-600 bg-blue-50"
                    : "border-zinc-200 bg-white hover:bg-zinc-50"
            )}
        >
            <div className="flex items-center gap-3">
                <div
                    className={cn(
                        "h-5 w-5 rounded-full border-2",
                        selected
                            ? "border-blue-600 bg-blue-600"
                            : "border-zinc-300"
                    )}
                />
                <span>{text}</span>
            </div>
        </button>
    );
}