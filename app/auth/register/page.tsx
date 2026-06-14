import { AuthLayout } from "@/components/auth/auth-layout";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
    return (
        <AuthLayout
            title="Создание аккаунта"
            description="Создайте аккаунт для прохождения программ дополнительного профессионального образования."
        >
            <RegisterForm />
        </AuthLayout>
    );
}