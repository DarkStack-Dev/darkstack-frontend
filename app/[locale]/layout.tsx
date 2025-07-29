import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Providers } from "@/components/Layouts/Providers";
import { handleGetUser } from "@/lib/server/auth";
import { MainLayout } from "@/components/Layouts/MainLayout";
import NextTopLoader from "nextjs-toploader";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ReactNode } from "react";
import { getValidatedLocale, supportedLocales } from "@/i18n/config";

// Fontes (configuração otimizada)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

// Metadados
export const metadata: Metadata = {
  title: {
    default: "DarkStack",
    template: "%s | DarkStack"
  },
  description: "Comunidade que vai revolucionar tudo que há de desenvolvimento em programação...",
};

// Geração de parâmetros estáticos
export function generateStaticParams() {
  return supportedLocales.map(locale => ({ locale }));
}

export default async function RootLocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  // 1. Solução definitiva para o erro do params.locale
  const validatedParams = await Promise.resolve(params);
  const locale = await getValidatedLocale(validatedParams);
  
  // 2. Carregamento otimizado com fallback seguro
  const [user, messages] = await Promise.allSettled([
    handleGetUser().catch(() => null), // Fallback explícito
    getMessages({ locale }).catch(() => ({})), // Fallback vazio
  ]);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <NextTopLoader
          color="#2563eb"
          height={2}
          showSpinner={false}
        />
        <NextIntlClientProvider
          locale={locale}
          messages={messages.status === 'fulfilled' ? messages.value : {}}
          timeZone="America/Sao_Paulo"
          now={new Date()}
        >
          <Providers>
            <MainLayout user={user.status === 'fulfilled' ? user.value : null}>
              {children}
            </MainLayout>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}