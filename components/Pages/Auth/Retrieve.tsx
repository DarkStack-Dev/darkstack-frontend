//RECUPERAR SENHA

"use client";

import React, { useState } from "react";
import Link from "next/link";

export const RetrievePage = () => {
const [email, setEmail] = useState("");

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Aqui futuramente vai o envio do código para o email
};

return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200 px-4">
    <form
        onSubmit={handleSubmit}
        className="bg-gray-800 dark:bg-white shadow-xl rounded-xl p-8 w-full max-w-md transition-colors duration-200"
    >
        <h1 className="text-3xl font-bold text-center mb-6 text-white dark:text-gray-800">
        Recuperar Senha
        </h1>

        <p className="text-sm text-center mb-4 text-gray-300 dark:text-gray-700">
        Informe seu e-mail para receber um código de recuperação.
        </p>

        <div className="mb-4">
        <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300 dark:text-gray-700 mb-1"
        >
            E-mail
        </label>
        <input
            id="email"
            type="email"
            placeholder="Digite seu e-mail"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 dark:border-gray-300 bg-gray-700 dark:bg-white text-white dark:text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
        />
        </div>

        <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-200"
        >
        Enviar código
        </button>

        <div className="text-center mt-6 text-sm text-gray-300 dark:text-gray-600">
            <Link
            href="/auth/signin"
            className="text-blue-400 dark:text-blue-600 hover:underline font-medium"
        >
            Voltar para o login
        </Link>
        </div>
    </form>
    </div>
);
};
