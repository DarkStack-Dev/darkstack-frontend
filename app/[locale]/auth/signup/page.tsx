import { SignUpPage } from "@/components/Pages/Auth/SignUp";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

// Função generateMetadata corrigida para Next.js 15+
export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>
}): Promise<Metadata> {
  // Aguarda o objeto params antes de acessar suas propriedades
  const { locale } = await params;
  // Busca a tradução usando o namespace que já criamos
  const t = await getTranslations({locale, namespace: 'SignUpPage'});
 
  return {
    title: t('title')
  };
}

const SignUp = async ({
  params
}: {
  params: Promise<{locale: string}>
}) => {
  // Se você precisar usar params no componente, também deve aguardá-lo
  const { locale } = await params;
  
  return (
    <>
      <SignUpPage />
    </>
  );
}

export default SignUp;