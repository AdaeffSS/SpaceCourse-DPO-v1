import { ArrowLeft, Lock, Pencil } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
    ProfileForm,
    type ProfileFormValues,
} from "@/components/profiles/profile-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ProfilePageData = {
    id: string;
    fullName: string;
    isLocked: boolean;
    form: ProfileFormValues;
    courses: string[];
};

const profiles: ProfilePageData[] = [
    {
        id: "1",
        fullName: "Иванов Иван Иванович",
        isLocked: true,
        form: {
            lastName: "Иванов",
            firstName: "Иван",
            middleName: "Иванович",
            birthDate: "1988-04-14",
            educationLevel: "Высшее образование",
            organizationName: "МГТУ им. Н. Э. Баумана",
            specialty: "Педагогика и методика преподавания",
            diplomaDate: "2010-06-25",
        },
        courses: [
            "Методика преподавания выбранной дисциплины в организациях СОО и ООО",
            "Современные технологии дистанционного обучения и проектирование цифровых курсов",
            "Организация образовательного процесса в цифровой среде",
        ],
    },
    {
        id: "2",
        fullName: "Петрова Анна Сергеевна",
        isLocked: false,
        form: {
            lastName: "Петрова",
            firstName: "Анна",
            middleName: "Сергеевна",
            birthDate: "1993-09-02",
            educationLevel: "Среднее профессиональное образование",
            organizationName: "Колледж информационных технологий",
            specialty: "Информационные системы и программирование",
            diplomaDate: "2013-06-15",
        },
        courses: [],
    },
    {
        id: "3",
        fullName: "Смирнов Дмитрий Олегович",
        isLocked: true,
        form: {
            lastName: "Смирнов",
            firstName: "Дмитрий",
            middleName: "Олегович",
            birthDate: "1985-11-08",
            educationLevel: "Высшее образование",
            organizationName: "Российский университет спорта",
            specialty: "Физическая культура",
            diplomaDate: "2008-07-01",
        },
        courses: [
            "Методика преподавания выбранной дисциплины в организациях СОО и ООО",
            "Организация образовательного процесса в цифровой среде",
        ],
    },
];

export function generateStaticParams() {
    return profiles.map((profile) => ({
        id: profile.id,
    }));
}

type ProfileDetailsPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function ProfileDetailsPage({
                                                     params,
                                                 }: ProfileDetailsPageProps) {
    const { id } = await params;

    const profile = profiles.find((item) => item.id === id);

    if (!profile) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <Button
                variant="ghost"
                asChild
                className="h-10 rounded-xl px-3"
            >
                <Link href="/profiles">
                    <ArrowLeft className="h-4 w-4" />
                    Назад к профилям
                </Link>
            </Button>

            <Card className="rounded-3xl border border-zinc-200/70 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
                <CardContent className="p-6 md:p-8">
                    <div className="flex items-start gap-4">
                        <div
                            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                                profile.isLocked
                                    ? "bg-amber-50 text-amber-600"
                                    : "bg-emerald-50 text-emerald-600"
                            }`}
                        >
                            {profile.isLocked ? (
                                <Lock className="h-5 w-5" />
                            ) : (
                                <Pencil className="h-5 w-5" />
                            )}
                        </div>

                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
                                {profile.fullName}
                            </h1>

                            <p className="mt-2 max-w-3xl text-zinc-600">
                                {profile.isLocked
                                    ? "Профиль используется в программах обучения. Изменение данных недоступно. Для корректировки информации создайте новый профиль обучающегося."
                                    : "Профиль пока не используется в программах обучения. Вы можете изменить данные перед записью на курс."}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {profile.isLocked ? (
                <>
                    <Card className="rounded-3xl border border-zinc-200/70 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
                        <CardContent className="p-6 md:p-8">
                            <h2 className="text-2xl font-semibold text-zinc-950">
                                Данные обучающегося
                            </h2>

                            <div className="mt-6 grid gap-4 md:grid-cols-2">
                                <InfoItem label="Фамилия" value={profile.form.lastName} />
                                <InfoItem label="Имя" value={profile.form.firstName} />
                                <InfoItem label="Отчество" value={profile.form.middleName} />
                                <InfoItem label="Дата рождения" value={profile.form.birthDate} />
                                <InfoItem label="Уровень образования" value={profile.form.educationLevel} />
                                <InfoItem label="Дата выдачи диплома" value={profile.form.diplomaDate} />

                                <div className="md:col-span-2">
                                    <InfoItem
                                        label="Образовательная организация"
                                        value={profile.form.organizationName}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <InfoItem
                                        label="Специальность"
                                        value={profile.form.specialty}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {profile.courses.length > 0 && (
                        <Card className="rounded-3xl border border-zinc-200/70 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
                            <CardContent className="p-6 md:p-8">
                                <h2 className="text-2xl font-semibold text-zinc-950">
                                    Используется в программах
                                </h2>

                                <div className="mt-5 grid gap-3">
                                    {profile.courses.map((course) => (
                                        <div
                                            key={course}
                                            className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
                                        >
                                            {course}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </>
            ) : (
                <ProfileForm
                    title="Редактирование профиля"
                    description="Этот профиль ещё не используется в программах обучения и может быть изменён."
                    submitLabel="Сохранить изменения"
                    initialValues={profile.form}
                />
            )}
        </div>
    );
}

function InfoItem({
                      label,
                      value,
                  }: {
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-xs font-medium text-zinc-500">
                {label}
            </p>

            <p className="mt-2 text-sm font-medium text-zinc-900">
                {value}
            </p>
        </div>
    );
}