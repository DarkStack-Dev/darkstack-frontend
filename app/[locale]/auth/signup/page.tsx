import { SignUpPage } from "@/components/Pages/Auth/SignUp";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

// Transforma o metadata em uma função assíncrona para buscar a tradução
export async function generateMetadata({params: {locale}}: {params: {locale: string}}): Promise<Metadata> {
  // Busca a tradução usando o namespace que já criamos
  const t = await getTranslations({locale, namespace: 'SignUpPage'});
 
  return {
    title: t('title')
  };
}

const SignUp = () => {
    return (
        <>
            <SignUpPage />
        </>
    )
}

export default SignUp;