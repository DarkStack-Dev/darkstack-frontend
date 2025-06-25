import { SignUpPage } from "@/components/Pages/Auth/SignUp";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Register"
}

const SignUp = () => {
    return (
        <>
            <SignUpPage />
        </>
    )
}

export default SignUp;