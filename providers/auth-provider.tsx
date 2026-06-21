"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { Loader2 } from "lucide-react";

import { usePathname } from "next/navigation";

import {
    api,
    logout,
    setToken,
} from "@/lib/api";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL!;

export type CurrentUser = {
    sub: string;
    email: string;
    roles: string[];
};

type AuthContextValue = {
    user: CurrentUser | null;
    loading: boolean;
    refreshUser: () => Promise<void>;
};

const AuthContext =
    createContext<AuthContextValue | null>(
        null,
    );

export function AuthProvider({
                                 children,
                             }: {
    children: React.ReactNode;
}) {
    const pathname =
        usePathname();

    const [user, setUser] =
        useState<CurrentUser | null>(
            null,
        );

    const [loading, setLoading] =
        useState(true);

    const isAuthPage =
        pathname.startsWith(
            "/auth",
        );

    async function refreshUser() {
        try {
            const data = await api<{
                accessToken: string;
                user: CurrentUser;
            }>("/auth/session", {
                method: "POST",
            });

            setToken(data.accessToken);
            setUser(data.user);
        } catch {
            setUser(null);
        }
    }

    useEffect(() => {
        if (isAuthPage) {
            setLoading(false);
            return;
        }

        let mounted = true;

        refreshUser()
            .finally(() => {
                if (mounted) {
                    setLoading(false);
                }
            });

        return () => {
            mounted = false;
        };
    }, [isAuthPage]);

    if (
        !isAuthPage &&
        loading
    ) {
        return (
            <div className="flex h-screen items-center justify-center bg-zinc-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2
                        size={32}
                        className="animate-spin text-blue-600"
                    />

                    <p className="text-sm text-zinc-500">
                        Проверка авторизации...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider",
        );
    }

    return context;
}