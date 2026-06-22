import { GraduationCap } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type ProfileSelectorProps = {
    fullName: string;
    educationLevel: string;
    organizationName: string;
};

export function ProfileSelector({
                                    fullName,
                                    educationLevel,
                                    organizationName,
                                }: ProfileSelectorProps) {
    return (
        <Card className="rounded-3xl border border-zinc-200/70 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
            <CardContent className="p-6">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                        <GraduationCap className="h-5 w-5" />
                    </div>

                    <div className="flex-1">
                        <h2 className="text-xl font-semibold text-zinc-950">
                            Обучающийся
                        </h2>

                        <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                            <p className="text-lg font-medium text-zinc-950">
                                {fullName}
                            </p>

                            <p className="mt-2 text-sm text-zinc-600">
                                {educationLevel}
                            </p>

                            <p className="mt-1 text-sm text-zinc-600">
                                {organizationName}
                            </p>
                        </div>

                        <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-900">
                            Профиль обучающегося был выбран при зачислении на программу и не может быть изменён после начала обучения.
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}