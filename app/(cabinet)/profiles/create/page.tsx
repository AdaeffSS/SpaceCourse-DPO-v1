import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { ProfileForm, emptyProfileValues } from "@/components/profiles/profile-form";
import { Button } from "@/components/ui/button";

export default function CreateProfilePage() {
    return (
        <div className="space-y-6">
            <Button variant="ghost" asChild className="h-10 rounded-xl px-3">
                <Link href="/profiles">
                    <ArrowLeft className="h-4 w-4" />
                    Назад к профилям
                </Link>
            </Button>

            <ProfileForm
                title="Создание профиля"
                description="Заполните данные обучающегося один раз. Затем этот профиль можно будет выбирать при зачислении на любой курс."
                submitLabel="Создать профиль"
                initialValues={emptyProfileValues}
            />
        </div>
    );
}