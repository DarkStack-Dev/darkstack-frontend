import { SignInPage } from "@/components/Pages/Auth/SignIn";
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
  const t = await getTranslations({locale, namespace: 'SignInPage'});
 
  return {
    title: t('title')
  };
}

const SignIn = async ({
  params
}: {
  params: Promise<{locale: string}>
}) => {
  // Se você precisar usar params no componente, também deve aguardá-lo
  const { locale } = await params;
  
  return (
    <>
      <SignInPage />
    </>
  );
}

export default SignIn;