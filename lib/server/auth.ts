// lib/server/auth.ts - CORRIGIDO COM DEBUG
"use server";

import { cookies } from "next/headers";
import { signIn, signUp, gitHubCallback } from "@/lib/requests";
import { SignInData, SignUpData } from "@/lib/schemas/authSchemas";
import { User } from "@/types/accounts/user";
import { redirect } from "next/navigation";
import { startGitHubAuth, linkGitHubAccount, unlinkGitHubAccount } from "@/lib/requests";
import { GitHubCallbackData, GitHubLinkData } from "@/lib/requests";
import { startGoogleAuth, googleCallback, linkGoogleAccount, unlinkGoogleAccount } from "@/lib/requests";
import { GoogleCallbackData, GoogleLinkData } from "@/lib/requests";

export const handleSignIn = async (data: SignInData) => {
    const response = await signIn(data)
    console.log("response.data aaaaaaaaaaaa", response)
    if (response.data) {
        console.log("response.data", response.data)
        const cookieStore = await cookies()
        cookieStore.set({
            name: process.env.NEXT_PUBLIC_AUTH_KEY as string,
            value: response.data.authToken,
            httpOnly: true,
            maxAge: 86400 * 7 // 7 days
        })
    }

    return response
}

export const handleSignUp = async (data: SignUpData) => {
    const response = await signUp(data)
    console.log("response bbbbbbbbbbb", response)
    if (response.data) {
        const cookieStore = await cookies()
        cookieStore.set({
            name: process.env.NEXT_PUBLIC_AUTH_KEY as string,
            value: response.data.authToken,
            httpOnly: true,
            maxAge: 86400 * 7
        })
    }

    return response
}

// ✅ FUNÇÃO CORRIGIDA COM TRATAMENTO ROBUSTO DE ERROS
export const handleGetUser = async (): Promise<User | null> => {
    try {
        const cookieStore = await cookies()
        const authCookie = cookieStore.get(process.env.NEXT_PUBLIC_AUTH_KEY as string)?.value

        console.log("🔍 Auth Cookie:", authCookie ? 'Present' : 'Missing')

        if (!authCookie) {
            console.log("❌ No auth cookie found")
            return null
        }

        // ✅ VERIFICAÇÕES DE AMBIENTE
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL
        if (!apiUrl) {
            console.error("❌ NEXT_PUBLIC_API_BASE_URL não configurado")
            return null
        }

        console.log("🔍 API URL:", apiUrl)

        // ✅ TIMEOUT E CONFIGURAÇÕES ROBUSTAS PARA FETCH
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos timeout

        const response = await fetch(`${apiUrl}users`, {
            headers: {
                Authorization: `Bearer ${authCookie}`,
                'Content-Type': 'application/json'
            },
            signal: controller.signal,
            cache: 'no-cache' // ✅ Evitar cache em requisições de auth
        })

        clearTimeout(timeoutId)

        console.log("🔍 Response Status:", response.status)
        console.log("🔍 Response Headers:", Object.fromEntries(response.headers.entries()))

        // ✅ VERIFICAR SE A RESPOSTA É JSON ANTES DE FAZER PARSE
        const contentType = response.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
            console.log("❌ Response is not JSON. Content-Type:", contentType)
            
            // ✅ TENTAR LER COMO TEXTO PARA DEBUG
            try {
                const textResponse = await response.text()
                console.log("❌ Raw response (first 500 chars):", textResponse.substring(0, 500))
            } catch (textError) {
                console.log("❌ Couldn't even read response as text:", textError)
            }
            
            return null
        }

        // ✅ VERIFICAR STATUS DA RESPOSTA
        if (!response.ok) {
            console.log("❌ Response not OK:", response.status, response.statusText)
            
            try {
                const errorText = await response.text()
                console.log("❌ Error response:", errorText.substring(0, 500))
            } catch {
                console.log("❌ Couldn't read error response")
            }
            
            return null
        }

        // ✅ TENTAR FAZER PARSE DO JSON COM TRATAMENTO DE ERRO
        let jsonResponse
        try {
            jsonResponse = await response.json()
        } catch (parseError) {
            console.error("❌ Failed to parse JSON:", parseError)
            
            // ✅ TENTAR LER COMO TEXTO PARA VER O QUE VEIO
            try {
                const rawText = await response.text()
                console.log("❌ Raw response that failed to parse:", rawText.substring(0, 500))
            } catch {
                console.log("❌ Couldn't read response after JSON parse failed")
            }
            
            return null
        }

        console.log("✅ JSON Response:", jsonResponse)

        if (jsonResponse.statusCode === 401 || jsonResponse.statusCode === 404) {
            console.log("❌ Unauthorized or Not Found")
            return null 
        } else {
            console.log("✅ User found:", jsonResponse.email || jsonResponse.id)
            return jsonResponse as User 
        }
    } catch (error) {
        // ✅ TRATAMENTO ESPECÍFICO PARA DIFERENTES TIPOS DE ERRO
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                console.error("❌ Request timeout in handleGetUser")
            } else if (error.message.includes('fetch')) {
                console.error("❌ Network error in handleGetUser:", error.message)
            } else {
                console.error("❌ Error in handleGetUser:", error.message)
            }
        } else {
            console.error("❌ Unknown error in handleGetUser:", error)
        }
        
        return null
    }
}

export const handleSignOut = async () => {
    const cookieStore = await cookies()
    cookieStore.delete(process.env.NEXT_PUBLIC_AUTH_KEY as string)
    redirect('/')
}

/* GitHub Auth Server Actions - CORRIGIDOS */
export const handleGitHubStart = async (state?: string) => {
    return await startGitHubAuth(state);
}

// ✅ CORRIGIDO: Chama apenas o backend NestJS
export const handleGitHubCallback = async (data: GitHubCallbackData) => {
    console.log('🔄 [Frontend] Calling backend with code:', data.code ? 'Present' : 'Missing');
    
    const response = await gitHubCallback(data);
    
    if (response.data) {
        console.log('✅ [Frontend] Backend returned success, setting cookie...');
        const cookieStore = await cookies();
        cookieStore.set({
            name: process.env.NEXT_PUBLIC_AUTH_KEY as string,
            value: response.data.authToken,
            httpOnly: true,
            maxAge: 86400 * 7 // 7 days
        });
    }
    
    return response;
}

export const handleGitHubLink = async (data: GitHubLinkData) => {
    return await linkGitHubAccount(data);
}

export const handleGitHubUnlink = async () => {
    return await unlinkGitHubAccount();
}

/* Google Auth Server Actions */
export const handleGoogleStart = async (state?: string) => {
    return await startGoogleAuth(state);
}

export const handleGoogleCallback = async (data: GoogleCallbackData) => {
    const response = await googleCallback(data);
    
    if (response.data) {
        const cookieStore = await cookies();
        cookieStore.set({
            name: process.env.NEXT_PUBLIC_AUTH_KEY as string,
            value: response.data.authToken,
            httpOnly: true,
            maxAge: 86400 * 7 // 7 days
        });
    }
    
    return response;
}

export const handleGoogleLink = async (data: GoogleLinkData) => {
    return await linkGoogleAccount(data);
}

export const handleGoogleUnlink = async () => {
    return await unlinkGoogleAccount();
}