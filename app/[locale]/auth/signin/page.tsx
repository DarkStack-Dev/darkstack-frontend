import { SignInPage } from "@/components/Pages/Auth/SignIn";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

// Transforma o metadata em uma função assíncrona
export async function generateMetadata({params: {locale}}: {params: {locale: string}}): Promise<Metadata> {
  const t = await getTranslations({locale, namespace: 'SignInPage'});
 
  return {
    title: t('title')
  };
}

const SignIn = () => {
    return (
        <>
            <SignInPage />
        </>
    )
}

export default SignIn;