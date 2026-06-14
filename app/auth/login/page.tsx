import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
    return (
        <AuthLayout
            title="Вход в личный кабинет"
            description="Введите email и пароль для доступа к образовательным программам."
        >
            <LoginForm />
        </AuthLayout>
    );
}