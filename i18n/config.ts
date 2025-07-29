import { notFound } from 'next/navigation';

export const supportedLocales = ['en', 'pt'] as const;
export type Locale = typeof supportedLocales[number];
export const defaultLocale: Locale = 'pt';

export async function getValidatedLocale(params: { locale: string }): Promise<Locale> {
    
    const { locale } = await Promise.resolve(params); 

    if (!supportedLocales.includes(locale as Locale)) {
    console.warn(`Locale não suportado: ${locale}`);
    notFound();
    }

    return locale as Locale;
}