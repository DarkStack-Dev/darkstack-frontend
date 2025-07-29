// components/Pages/Auth/SignUp.tsx
"use client";
import React, { useState } from "react";
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { handleSignUp } from "@/lib/server/auth";
import { SignUpData, signUpSchema } from "@/lib/schemas/authSchemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/authStore";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { GitHubButton } from "@/components/ui/GitHubButton";
import { GoogleButton } from "@/components/ui/GoogleButton";
import PasswordField from "@/components/ui/PasswordField";

// 1. Importações para a internacionalização
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation"; // Usar o Link e o Router especiais

export const SignUpPage = () => {
    // 2. Chamar o hook de tradução
    const t = useTranslations('SignUpForm');
    const tPolicy = useTranslations('SignUpForm.privacyPolicy');

    const [loading, setLoading] = useState(false);
    const setUser = useAuthStore(state => state.setUser);
    const router = useRouter();

    const form = useForm<SignUpData>({
        resolver: zodResolver(signUpSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            email: "",
            password: ""
        }
    });

    const onSubmit = async (values: SignUpData) => {
        setLoading(true);
        const response = await handleSignUp(values);

        if (response.error) {
            setLoading(false);
            toast.error(response.error.message, { position: "bottom-right" });
            return;
        }

        setUser(response.data.user);
        toast.success('Conta criada com sucesso!', { position: "bottom-right" });

        router.push("/auth/signin");
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
                            state="signup"
                        />
                        <GoogleButton 
                            text={t('googleButton')}
                            variant="outline"
                            className="bg-gray-700 dark:bg-gray-100 border-gray-600 dark:border-gray-300 text-white dark:text-gray-800 hover:bg-gray-600 dark:hover:bg-gray-200"
                            state="signup"
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

                    {loading ? (
                        [...Array(3)].map((_, key) => (
                            <Skeleton key={key} className="h-10 rounded-md mb-12" />
                        ))
                    ) : (
                        <>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="mb-4">
                                        <FormLabel htmlFor="name" className="block text-sm font-medium text-gray-300 dark:text-gray-700 mb-1">
                                            
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                id="name"
                                                type="text"
                                                placeholder={t('nameLabel')}
                                                {...field}
                                                className="w-full px-4 py-2 border border-gray-600 dark:border-gray-300 bg-gray-700 dark:bg-white text-white dark:text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-400 dark:text-red-600 text-sm mt-1" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="mb-4">
                                        <FormLabel className="block text-sm font-medium text-gray-300 dark:text-gray-700 mb-1">
                                            {t('emailLabel')}
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                type="email"
                                                placeholder={t('emailPlaceholder')}
                                                {...field}
                                                className="w-full px-4 py-2 border border-gray-600 dark:border-gray-300 bg-gray-700 dark:bg-white text-white dark:text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-400 dark:text-red-600 text-sm mt-1" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="mb-4">
                                        <FormLabel className="block text-sm font-medium text-gray-300 dark:text-gray-700 mb-1">
                                            {t('passwordLabel')}
                                        </FormLabel>
                                        <FormControl>
                                            {/* ✅ CORREÇÃO APLICADA AQUI */}
                                            <PasswordField field={field} placeholder={t('passwordPlaceholder')} />
                                        </FormControl>
                                        <FormMessage className="text-red-400 dark:text-red-600 text-sm mt-1" />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}

                    <div className="mb-4 flex items-start gap-2 text-sm text-gray-300 dark:text-gray-600">
                        <input
                            type="checkbox"
                            className="mt-1 rounded border-gray-500 dark:border-gray-300 text-blue-600 bg-gray-700 dark:bg-white focus:ring-blue-500"
                        />
                        <Sheet>
                            <SheetTrigger className="text-blue-400 hover:underline dark:text-blue-600 text-left">
                                {t('termsLink')}
                            </SheetTrigger>
                            <SheetContent side="right" className="overflow-y-auto">
                                <SheetHeader>
                                    <SheetTitle className="mb-4">{tPolicy('title')}</SheetTitle>
                                    <SheetDescription className="text-sm text-gray-600 space-y-4 text-left">
                                        <p>{tPolicy('p1')}</p>
                                        <p>{tPolicy('p2')}</p>
                                        <p>{tPolicy('p3')}</p>
                                        <p>{tPolicy('p4')}</p>
                                        <p>{tPolicy('p5')}</p>
                                        <h3 className="font-semibold mt-6">{tPolicy('userCommitmentTitle')}</h3>
                                        <ul className="list-disc ml-5 space-y-1">
                                            <li>{tPolicy('commitment1')}</li>
                                            <li>{tPolicy('commitment2')}</li>
                                            <li>{tPolicy('commitment3')}</li>
                                        </ul>
                                        <h3 className="font-semibold mt-6">{tPolicy('moreInfoTitle')}</h3>
                                        <p>{tPolicy('moreInfoText')}</p>
                                    </SheetDescription>
                                </SheetHeader>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Button
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-200"
                    >
                        {t('submitButton')}
                    </Button>

                    <div className="text-center mt-6 text-sm text-gray-300 dark:text-gray-600">
                        <p>
                            {t('hasAccount')}{" "}
                            <Link href="/auth/signin" className="text-blue-400 dark:text-blue-600 hover:underline font-medium">
                                {t('signInLink')}
                            </Link>
                        </p>
                    </div>
                </form>
            </Form>
        </div>
    );
};