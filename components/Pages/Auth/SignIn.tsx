// components/Pages/Auth/SignIn.tsx 
"use client";

import { useState } from "react";
import React from "react";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { handleSignIn } from "@/lib/server/auth";
import { SignInData, signInSchema } from "@/lib/schemas/authSchemas";
import { Form, FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GitHubButton } from "@/components/ui/GitHubButton";
import { GoogleButton } from "@/components/ui/GoogleButton";
import PasswordField from "@/components/ui/PasswordField";

// 1. Importações para a internacionalização
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation"; // Usar o Link e o Router especiais

export const SignInPage = () => {
    // 2. Chamar o hook de tradução
    const t = useTranslations('SignInForm');

    const [loading, setLoading] = useState(false);
    const setUser = useAuthStore(state => state.setUser);
    const router = useRouter();

    const form = useForm<SignInData>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const onSubmit = async (values: SignInData) => {
        setLoading(true);
        const response = await handleSignIn(values);

        if (response.error) {
            setLoading(false);
            toast.error(response.error.message, { position: "bottom-right" });
            return;
        }

        setUser(response.data.user);
        toast.success('Autenticado com sucesso!', { position: "bottom-right" });

        // Redireciona para projetos usando o router que entende idiomas
        router.push("/projects");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200 px-4">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="bg-gray-800 dark:bg-white shadow-xl rounded-xl p-8 w-full max-w-md transition-colors duration-200"
                >
                    {/* 3. Textos substituídos pelas traduções */}
                    <h1 className="text-3xl font-bold text-center mb-6 text-white dark:text-gray-800">
                        {t('title')}
                    </h1>

                    <div className="space-y-3 mb-6">
                        <GitHubButton 
                            text={t('githubButton')}
                            variant="outline"
                            className="bg-gray-700 dark:bg-gray-100 border-gray-600 dark:border-gray-300 text-white dark:text-gray-800 hover:bg-gray-600 dark:hover:bg-gray-200"
                            state="login"
                        />
                        <GoogleButton 
                            text={t('googleButton')}
                            variant="outline"
                            className="bg-gray-700 dark:bg-gray-100 border-gray-600 dark:border-gray-300 text-white dark:text-gray-800 hover:bg-gray-600 dark:hover:bg-gray-200"
                            state="login"
                        />
                    </div>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-600 dark:border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-800 dark:bg-white text-gray-400 dark:text-gray-600">
                                {t('divider')}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {loading ? (
                            [...Array(2)].map((_, key) => (
                                <Skeleton key={key} className="h-10 rounded-md" />
                            ))
                        ) : (
                            <>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <div className="mb-4">
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 dark:text-gray-700 mb-1">
                                                {t('emailLabel')}
                                            </label>
                                            <input
                                                type="email"
                                                placeholder={t('emailPlaceholder')}
                                                {...field}
                                                className="w-full px-4 py-2 border border-gray-600 dark:border-gray-300 bg-gray-700 dark:bg-white text-white dark:text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                                            />
                                        </div>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <div className="mb-4">
                                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 dark:text-gray-700 mb-1">
                                                {t('passwordLabel')}
                                            </label>
                                            {/* ✅ CORREÇÃO APLICADA AQUI */}
                                            <PasswordField field={field} placeholder={t('passwordPlaceholder')} />
                                        </div>
                                    )}
                                />
                            </>
                        )}
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <label className="flex items-center space-x-2 text-sm text-gray-300 dark:text-gray-600">
                            <input
                                type="checkbox"
                                className="rounded text-blue-600 focus:ring-blue-500 border-gray-500 dark:border-gray-300 bg-gray-700 dark:bg-white"
                            />
                            <span>{t('rememberMe')}</span>
                        </label>
                        <p>
                            <Link href="/auth/retrieve" className="text-sm text-blue-400 dark:text-blue-600 hover:underline">
                                {t('forgotPassword')}
                            </Link>
                        </p>
                    </div>

                    <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-200" 
                        disabled={loading}
                    >
                        {t('submitButton')}
                    </Button>
                    
                    <div className="text-center mt-6 text-sm text-gray-300 dark:text-gray-600">
                        <p>
                            {t('noAccount')}{" "}
                            <Link href="/auth/signup" className="text-blue-400 dark:text-blue-600 hover:underline font-medium">
                                {t('signUpLink')}
                            </Link>
                        </p>
                    </div>
                </form>
            </Form>
        </div>
    );
}