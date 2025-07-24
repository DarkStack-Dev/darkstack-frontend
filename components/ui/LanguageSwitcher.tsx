"use client";

import { useRouter, usePathname } from "next/navigation";
import image from "next/image";



export default function LanguageSwitcher() {
    const router = useRouter();
    const pathname = usePathname();

    const changeLanguage = (locale: string) => {
        const segments = pathname.split("/");

        if (segments[1] === "pt" || segments[1] === "en") {
            segments[1] = locale;
        } else {
            segments.splice(1, 0, locale);
        }

        router.push(segments.join("/") || "/");
    };

    return (
        <select
            onChange={(e) => changeLanguage(e.target.value)}
            className="bg-transparent text-sm text-slate-700 dark:text-slate-300 focus:outline-none"
            defaultValue=""
        >
            <option disabled value="">🌐</option>
            <option value="pt">🇧🇷 PT</option>
            <option value="en">🇺🇸 EN</option>
        </select>
    );
}
