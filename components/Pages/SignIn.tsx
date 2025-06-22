"use client";

import { useState } from "react";
import React from "react";
import Link from "next/link";

export const SignInPage = () => {


 // Estados para armazenar as entradas do usuário
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // Função que é chamada quando o formulário é enviado
    const handleSubmit = (event: React. FormEvent<HTMLFormElement>) => {
        
    event.preventDefault();
    
};



    return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200 px-4">
    <form
        onSubmit={handleSubmit}
        className="bg-gray-800 dark:bg-white shadow-xl rounded-xl p-8 w-full max-w-md transition-colors duration-200"
    >
        <h1 className="text-3xl font-bold text-center mb-6 text-white dark:text-gray-800">
        Login
        </h1>

        <div className="mb-4">
        <label htmlFor="username" className="block text-sm font-medium text-gray-300 dark:text-gray-700 mb-1">
            E-mail
        </label>
        <input
            id="username"
            type="email"
            placeholder="Digite seu e-mail"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 dark:border-gray-300 bg-gray-700 dark:bg-white text-white dark:text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
        />
        </div>

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
            className="w-full px-4 py-2 border border-gray-600 dark:border-gray-300 bg-gray-700 dark:bg-white text-white dark:text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
        />
        </div>

        <div className="flex items-center justify-between mb-6">
        <label className="flex items-center space-x-2 text-sm text-gray-300 dark:text-gray-600">
            <input 
            type="checkbox" 
            className="rounded text-blue-600 focus:ring-blue-500 border-gray-500 dark:border-gray-300 bg-gray-700 dark:bg-white" 
            />
            <span>Lembrar de mim</span>
        </label>
        <a href="/auth/retrieve" className="text-sm text-blue-400 dark:text-blue-600 hover:underline">
            Esqueceu sua senha?
        </a>
        </div>

        <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-200"
        >
        Entrar
        </button>

        <div className="text-center mt-6 text-sm text-gray-300 dark:text-gray-600">
        <p>
            Não tem uma conta?{" "}
            <Link  href="/auth/signup" 
            className="text-blue-400 dark:text-blue-600 hover:underline font-medium">
            Registrar
            </Link>
            
            
        </p>
        </div>
    </form>
    </div>
);
}