"use server";

import { cookies } from "next/headers";
import {  signIn, signUp } from "@/lib/requests";
import { SignInData, SignUpData } from "@/lib/schemas/authSchemas";
import { User } from "@/types/accounts/user";
import { redirect } from "next/navigation";

export const handleSignIn = async (data: SignInData) => {
    const response = await signIn(data)

    if (response.data) {
        const cookieStore = await cookies() // Await aqui
        cookieStore.set({
            name: process.env.NEXT_PUBLIC_AUTH_KEY as string,
            value: response.data.authToken,
            httpOnly: true,
            maxAge: 86400 * 7 // 7 days
        })
    }

    return response
}

// isso é para fazer login automaticamente após fazer a conta
export const handleSignUp = async (data: SignUpData) => {
    const response = await signUp(data)

    if (response.data) {
        const cookieStore = await cookies() // Await aqui
        cookieStore.set({
            name: process.env.NEXT_PUBLIC_AUTH_KEY as string,
            value: response.data.authToken,
            httpOnly: true,
            maxAge: 86400 * 7
        })
    }

    return response
}

export const handleGetUser = async () => {
    const cookieStore = await cookies() // Await aqui
    const authCookie = cookieStore.get(process.env.NEXT_PUBLIC_AUTH_KEY as string)?.value

    const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/users', {
        headers: {
            Authorization: `Bearer ${authCookie}`
        }
    })
    console.log("esotu aqui")
    const jsonResponse = await response.json()
    console.log("jsonResponse", jsonResponse)
    const userData = jsonResponse
    console.log("userData", userData)
    if(userData.statusCode === 500){
        return null 
    }else{
       return userData as User 
    }

}

export const handleSignOut = async () => {
    const cookieStore = await cookies() // Await aqui
    cookieStore.delete(process.env.NEXT_PUBLIC_AUTH_KEY as string)
    redirect('/')
}
