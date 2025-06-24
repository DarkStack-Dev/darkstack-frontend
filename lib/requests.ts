import { RecoverData, SignInData, SignUpData } from "@/lib/schemas/authSchemas";
import { api } from "./api";
import { APISignIn } from "@/types/accounts/signin";
import { APISignUp } from "@/types/accounts/signup";
import { APIUserUpdate } from "@/types/accounts/user";



import { APIrecover } from "@/types/accounts/recover";


/* Auth / User */
export const signIn = async (data: SignInData) => {
    return await api<APISignIn>({
        endpoint: 'users/login',
        method: 'POST',
        withAuth: false,
        data
    })
}

export const signUp = async (data: SignUpData) => {
    return await api<APISignUp>({
        endpoint: 'accounts/signup',
        method: 'POST',
        withAuth: false,
        data
    })
}

export const updateUser = async (data: FormData) => {
    return await api<APIUserUpdate>({
        endpoint: 'accounts/me',
        method: 'PUT',
        data,
        withAttachment: true

    })
}

export const recoverUser = async (data: RecoverData) => {
    return await api<APIrecover>({
        endpoint: 'accounts/password/reset',
        method: 'POST',
        data
    })
}

export const resetUser = async (data: { password: string }, uidb64: string | string[], token: string | string[]) => {
    return await api({
        endpoint: `accounts/password/reset/${uidb64}/${token}`,
        method: "POST",
        data,
    });
};


