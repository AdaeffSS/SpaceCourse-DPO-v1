import { GraduationCap } from "lucide-react";

type AuthLayoutProps = {
    title: string;
    description: string;
    children: React.ReactNode;
};

export function AuthLayout({
                               title,
                               description,
                               children,
                           }: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">
                        <GraduationCap className="h-8 w-8" />
                    </div>

                    <h1 className="mt-5 text-3xl font-semibold tracking-tight text-zinc-950">
                        СПЦ ДПО
                    </h1>

                    <p className="mt-2 text-zinc-500">
                        Личный кабинет обучающегося
                    </p>
                </div>

                <div className="rounded-3xl border border-zinc-200/70 bg-white p-8 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-zinc-950">
                            {title}
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-zinc-600">
                            {description}
                        </p>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}