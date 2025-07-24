import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { InputHTMLAttributes } from "react";

interface PasswordFieldProps {
    field: InputHTMLAttributes<HTMLInputElement>;
}

export default function PasswordField({ field }: PasswordFieldProps) {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible((prev) => !prev);

    return (
    <div className="relative">
        <input
        {...field}
        id="password"
        type={isVisible ? "text" : "password"}
        placeholder="Digite sua senha"
        className="w-full px-4 py-2 border border-gray-600 dark:border-gray-300 bg-gray-700 dark:bg-white text-white dark:text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
        />
        <button
        type="button"
        onClick={toggleVisibility}
        className="absolute inset-y-0 end-0 flex items-center px-3 text-gray-400 hover:text-blue-500 focus:outline-none"
        aria-label={isVisible ? "Esconder senha" : "Mostrar senha"}
        >
        {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
    </div>
    );
}