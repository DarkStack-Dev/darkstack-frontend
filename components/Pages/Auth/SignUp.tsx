// components/Pages/Auth/SignUp.tsx - ATUALIZADO COM GOOGLE
"use client";
import Link from "next/link";
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
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { GitHubButton } from "@/components/ui/GitHubButton";
import { GoogleButton } from "@/components/ui/GoogleButton";

export const SignUpPage = () => {
    const [loading, setLoading] = useState(false)

    const setUser = useAuthStore(state => state.setUser)
    const router = useRouter()

    const form = useForm<SignUpData>({
        resolver: zodResolver(signUpSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            email: "",
            password: ""
        }
    })

    const onSubmit = async (values: SignUpData) => {
        setLoading(true)
        const response = await handleSignUp(values)
        console.log("response", response)
        if (response.error) {
            setLoading(false)
            toast.error(response.error.message, { position: "bottom-right" })
            return;
        }

        setUser(response.data.user)
        toast.success('Conta criada com sucesso!', { position: "bottom-right" })

        router.push("/auth/signin");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200 px-4">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="bg-gray-800 dark:bg-white shadow-xl rounded-xl p-8 w-full max-w-md transition-colors duration-200"
                >
                    <h1 className="text-3xl font-bold text-center mb-6 text-white dark:text-gray-800">
                        Criar Conta
                    </h1>

                    {/* Social Signup Buttons */}
                    <div className="space-y-3 mb-6">
                        <GitHubButton 
                            text="Criar conta com GitHub"
                            variant="outline"
                            className="bg-gray-700 dark:bg-gray-100 border-gray-600 dark:border-gray-300 text-white dark:text-gray-800 hover:bg-gray-600 dark:hover:bg-gray-200"
                            state="signup"
                        />
                        <GoogleButton 
                            text="Criar conta com Google"
                            variant="outline"
                            className="bg-gray-700 dark:bg-gray-100 border-gray-600 dark:border-gray-300 text-white dark:text-gray-800 hover:bg-gray-600 dark:hover:bg-gray-200"
                            state="signup"
                        />
                    </div>

                    {/* Divider */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-600 dark:border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-800 dark:bg-white text-gray-400 dark:text-gray-600">
                                ou crie com email
                            </span>
                        </div>
                    </div>

                    {loading ?
                        (
                            [...Array(3)].map((_, key) => (
                                <>
                                    <Skeleton key={key} className="h-10 rounded-md mb-12" />
                                </>
                            ))
                        )
                        :
                        <>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="mb-4">
                                        <FormLabel htmlFor="name" className="block text-sm font-medium text-gray-300 dark:text-gray-700 mb-1">
                                            Nome
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                id="name"
                                                type="text"
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
                                            Gmail
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                type="email"
                                                placeholder="Digite seu gmail"
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
                                            Senha
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                type="password"
                                                placeholder="Digite sua senha"
                                                {...field}
                                                className="w-full px-4 py-2 border border-gray-600 dark:border-gray-300 bg-gray-700 dark:bg-white text-white dark:text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-400 dark:text-red-600 text-sm mt-1" />
                                    </FormItem>
                                )}
                            />
                        </>
                    }

                    <div className="mb-4 flex items-start gap-2 text-sm text-gray-300 dark:text-gray-600">
                        <input
                            type="checkbox"
                            className="mt-1 rounded border-gray-500 dark:border-gray-300 text-blue-600 bg-gray-700 dark:bg-white focus:ring-blue-500"
                        />

                        <Sheet>
                            <SheetTrigger className="text-blue-400 hover:underline dark:text-blue-600">
                                Política de Privacidade e Termos de Uso
                            </SheetTrigger>
                            <SheetContent side="right" className="overflow-y-auto">
                                <SheetHeader>
                                    <SheetTitle className="mb-4">Política de Privacidade</SheetTitle>
                                    <SheetDescription className="text-sm text-gray-600 space-y-4">
                                        <p>A sua privacidade é importante para nós. É política do darkstackdev respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site <a href="https://darkstackdev.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">darkstackdev</a>.</p>
                                        <p>Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento.</p>
                                        <p>Apenas retemos as informações pelo tempo necessário. Protegemos com meios aceitáveis para evitar perdas, roubos e acessos não autorizados.</p>
                                        <p>Não compartilhamos dados pessoais, exceto quando exigido por lei.</p>
                                        <p>Nosso site pode conter links para sites externos, e não nos responsabilizamos pelas políticas deles. Veja mais em <a href="https://politicaprivacidade.com/" className="text-blue-500 underline" target="_blank">politicaprivacidade.com</a>.</p>
                                        <ul className="list-disc ml-5 space-y-1">
                                            <li>Usamos Google AdSense com cookies DoubleClick para anúncios relevantes.</li>
                                            <li>Utilizamos cookies comportamentais para melhorar sua experiência.</li>
                                            <li>Cookies de afiliados identificam acessos e promoções realizadas via parceiros.</li>
                                        </ul>
                                        <h3 className="font-semibold mt-6">Compromisso do Usuário</h3>
                                        <ul className="list-disc ml-5 space-y-1">
                                            <li>Não realizar atividades ilegais ou contrárias à boa fé.</li>
                                            <li>Não difundir conteúdo racista, xenofóbico ou contra direitos humanos.</li>
                                            <li>Não causar danos a sistemas físicos e lógicos do site.</li>
                                        </ul>
                                        <h3 className="font-semibold mt-6">Mais informações</h3>
                                        <p>Esta política é válida a partir de 22 de junho de 2025.</p>
                                    </SheetDescription>
                                </SheetHeader>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Button
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-200"
                    >
                        Registrar
                    </Button>

                    <div className="text-center mt-6 text-sm text-gray-300 dark:text-gray-600">
                        <p>
                            Já tem uma conta?{" "}
                            <Link href="/auth/signin" className="text-blue-400 dark:text-blue-600 hover:underline font-medium">
                                Entrar
                            </Link>
                        </p>
                    </div>
                </form>
            </Form>
        </div>
    );
};