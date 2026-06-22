"use client";

import {
    type ChangeEvent,
    type FormEvent,
    useState,
} from "react";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type ProfileFormValues = {
    lastName: string;
    firstName: string;
    middleName: string;
    birthDate: string;
    educationLevel: string;
    organizationName: string;
    specialty: string;
    diplomaDate: string;
};

export const emptyProfileValues: ProfileFormValues = {
    lastName: "",
    firstName: "",
    middleName: "",
    birthDate: "",
    educationLevel: "Высшее образование",
    organizationName: "",
    specialty: "",
    diplomaDate: "",
};

type ProfileFormProps = {
    title: string;
    description: string;
    submitLabel: string;
    initialValues?: ProfileFormValues;
};

const inputClass =
    "mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900";

const selectClass =
    "mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-950 outline-none transition focus:border-zinc-900";

function FieldLabel({ children }: { children: React.ReactNode }) {
    return <span className="text-sm font-medium text-zinc-950">{children}</span>;
}

export function ProfileForm({
                                title,
                                description,
                                submitLabel,
                                initialValues = emptyProfileValues,
                            }: ProfileFormProps) {
    const [values, setValues] = useState<ProfileFormValues>(initialValues);
    const [scanFileName, setScanFileName] = useState("Файл не выбран");

    const handleChange = (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = event.target;

        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setScanFileName(file ? file.name : "Файл не выбран");
    };

    const handleReset = () => {
        setValues(initialValues);
        setScanFileName("Файл не выбран");
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("profile-save", values, scanFileName);
    };

    return (
        <Card className="rounded-3xl border border-zinc-200/70 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
            <CardContent className="p-6 md:p-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
                        {title}
                    </h1>
                    <p className="max-w-3xl text-base leading-6 text-zinc-600">
                        {description}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-8">
                    <div className="grid gap-8 lg:grid-cols-2">
                        <section className="space-y-5">
                            <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
                                Личные данные
                            </h2>

                            <div className="grid gap-4 md:grid-cols-2">
                                <label className="block">
                                    <FieldLabel>Фамилия</FieldLabel>
                                    <input
                                        name="lastName"
                                        value={values.lastName}
                                        onChange={handleChange}
                                        className={inputClass}
                                        placeholder="Введите фамилию"
                                    />
                                </label>

                                <label className="block">
                                    <FieldLabel>Имя</FieldLabel>
                                    <input
                                        name="firstName"
                                        value={values.firstName}
                                        onChange={handleChange}
                                        className={inputClass}
                                        placeholder="Введите имя"
                                    />
                                </label>

                                <label className="block md:col-span-2">
                                    <FieldLabel>Отчество</FieldLabel>
                                    <input
                                        name="middleName"
                                        value={values.middleName}
                                        onChange={handleChange}
                                        className={inputClass}
                                        placeholder="Введите отчество"
                                    />
                                </label>
                            </div>

                            <label className="block">
                                <FieldLabel>Дата рождения</FieldLabel>
                                <input
                                    type="date"
                                    name="birthDate"
                                    value={values.birthDate}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </label>

                            <label className="block">
                                <FieldLabel>Ваше образование</FieldLabel>
                                <select
                                    name="educationLevel"
                                    value={values.educationLevel}
                                    onChange={handleChange}
                                    className={selectClass}
                                >
                                    <option>Высшее образование</option>
                                    <option>Среднее профессиональное образование</option>
                                    <option>Среднее общее образование</option>
                                    <option>Другое</option>
                                </select>
                            </label>
                        </section>

                        <section className="space-y-5">
                            <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
                                Данные об образовании
                            </h2>

                            <label className="block">
                                <FieldLabel>Полное наименование организации</FieldLabel>
                                <input
                                    name="organizationName"
                                    value={values.organizationName}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder="Введите наименование организации"
                                />
                            </label>

                            <label className="block">
                                <FieldLabel>Специальность согласно диплому</FieldLabel>
                                <input
                                    name="specialty"
                                    value={values.specialty}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder="Введите специальность"
                                />
                            </label>

                            <label className="block">
                                <FieldLabel>Дата выдачи диплома</FieldLabel>
                                <input
                                    type="date"
                                    name="diplomaDate"
                                    value={values.diplomaDate}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </label>

                            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-4 transition hover:bg-zinc-100">
                                <div>
                                    <p className="text-sm font-medium text-zinc-950">Скан диплома</p>
                                    <p className="mt-1 text-xs text-zinc-500">{scanFileName}</p>
                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-zinc-500 shadow-sm">
                                    <Upload className="h-4 w-4" />
                                </div>

                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                                    className="sr-only"
                                    onChange={handleFileChange}
                                />
                            </label>

                            <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-4 text-sm leading-6 text-blue-900">
                                После создания профиль можно использовать при записи на несколько программ обучения. После зачисления данные профиля закрепляются за программой и не могут быть изменены.
                            </div>
                        </section>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button
                            type="submit"
                            className="h-11 rounded-xl px-5 text-sm font-medium"
                        >
                            {submitLabel}
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            className="h-11 rounded-xl px-5 text-sm font-medium"
                            onClick={handleReset}
                        >
                            Сбросить
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}