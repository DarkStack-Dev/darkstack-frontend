//REGISTRO criar conta
//NOME
//GMAIL
//SENHA
//CONFIRMAR SENHA

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

export const SignUpPage = () => {
  // Estados para armazenar as entradas do usuário
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [acceptedTerms, setAcceptedTerms] = useState(false);
const [errorMessage, setErrorMessage] = useState("");

  // Função chamada ao enviar o formulário
const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validação simples
    if (!acceptedTerms) {
    setErrorMessage("Você deve aceitar os termos de uso.");
    return;
    }

    if (password !== confirmPassword) {
    setErrorMessage("As senhas não coincidem.");
    return;
    }

    setErrorMessage(""); // Limpa erro

    // Aqui você pode enviar os dados para uma API ou salvar
    console.log("Registrando:", { name, email, password });

    // Limpar os campos
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
};

return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200 px-4">
    <form
        onSubmit={handleSubmit}
        className="bg-gray-800 dark:bg-white shadow-xl rounded-xl p-8 w-full max-w-md transition-colors duration-200"
    >
        <h1 className="text-3xl font-bold text-center mb-6 text-white dark:text-gray-800">
        Criar Conta
        </h1>

        {/* NOME */}
        <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 dark:text-gray-700 mb-1">
            Nome
        </label>
        <input
            id="name"
            type="text"
            placeholder="Digite seu nome"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 dark:border-gray-300 bg-gray-700 dark:bg-white text-white dark:text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500"
        />
        </div>

        {/* EMAIL */}
        <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 dark:text-gray-700 mb-1">
            Gmail
        </label>
        <input
            id="email"
            type="email"
            placeholder="Digite seu gmail"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 dark:border-gray-300 bg-gray-700 dark:bg-white text-white dark:text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500"
        />
        </div>

        {/* SENHA */}
        <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-300 dark:text-gray-700 mb-1">
            Senha
        </label>
        <input
            id="password"
            type="password"
            placeholder="Digite sua senha"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 dark:border-gray-300 bg-gray-700 dark:bg-white text-white dark:text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500"
        />
        </div>

        {/* CONFIRMAR SENHA */}
        <div className="mb-4">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 dark:text-gray-700 mb-1">
            Confirmar Senha
        </label>
        <input
            id="confirmPassword"
            type="password"
            placeholder="Confirme sua senha"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 dark:border-gray-300 bg-gray-700 dark:bg-white text-white dark:text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500"
        />
        </div>
        

        {/* Checkbox de aceitar termos + botão Sheet */}
        <div className="mb-4 flex items-start gap-2 text-sm text-gray-300 dark:text-gray-600">
        <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
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
    
        





        {/* MENSAGEM DE ERRO */}
        {errorMessage && (
        <div className="mb-4 text-red-400 text-sm text-center">
            {errorMessage}
        </div>
        )}

        {/* BOTÃO DE REGISTRAR */}
        <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-200"
        >
        Registrar
        </button>

        {/* LINK PARA LOGIN */}
        <div className="text-center mt-6 text-sm text-gray-300 dark:text-gray-600">
        <p>
            Já tem uma conta?{" "}
            <Link  href="/auth/signin" className="text-blue-400 dark:text-blue-600 hover:underline font-medium">
            Entrar
            </Link>
        </p>
        </div>
    </form>
    </div>
);
};
