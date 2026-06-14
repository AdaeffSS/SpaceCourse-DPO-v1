import { FileQuestion } from "lucide-react";

type EmptyStateProps = {
    title: string;
    description: string;
};

export function EmptyState({
                               title,
                               description,
                           }: EmptyStateProps) {
    return (
        <div className="rounded-3xl border border-dashed border-zinc-300 bg-white px-8 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
                <FileQuestion className="h-8 w-8 text-zinc-500" />
            </div>

            <h2 className="mt-5 text-2xl font-semibold text-zinc-950">
                {title}
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-zinc-600">
                {description}
            </p>
        </div>
    );
}