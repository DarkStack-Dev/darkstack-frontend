import { SignInPage } from "@/components/Pages/Auth/SignIn";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login"
}

const SignIn = () => {
    return (
        <>
            <SignInPage />
        </>
    )
}

export default SignIn;