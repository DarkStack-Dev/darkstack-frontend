"use server";

import { APIError } from "@/types/Api";
import { cookies } from "next/headers";
import axios, { AxiosError } from "axios";

type Props = {
    endpoint: string,
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: object,
    withAuth?: boolean,
    withAttachment?: boolean
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const api = async <TypeResponse>({
    endpoint,
    method = 'GET',
    data,
    withAuth = true,
    withAttachment = false
}: Props) => {
    const instance = axios.create({
        baseURL: BASE_URL
    })

    if (withAuth) {
        /* Getting auth cookie */
        const sessionAuth = cookies().get(process.env.NEXT_PUBLIC_AUTH_KEY as string)

        if (sessionAuth?.value) {
            instance.defaults.headers.common['Authorization'] = `Bearer ${sessionAuth.value}`
        }
    }

    if (withAttachment) {
        instance.defaults.headers.common['Content-Type'] = 'multipart/form-data'
    }

    try {
        const request = await instance<TypeResponse>(endpoint, {
            method,
            params: method == 'GET' && data,
            data: method != 'GET' && data
        })
        console.log("request =============", request.data)
        return {
            data: request.data
        }
    } catch (error) {
        const e = error as AxiosError<APIError>
        console.log("request", e)
        console.log("request", e.response?.data.message)
        return {
            error: {
                
                message: e.response?.data.message ?? 'Ocorreu um erro inesperadoaaaaa'
            }
        }
    }
}