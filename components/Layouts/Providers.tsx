"use client";

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { useEffect } from 'react';
import dayjs from 'dayjs';
//import { io } from 'socket.io-client';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import 'dayjs/locale/pt-br'

//export const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL as string)

export const Providers = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        // Set locale to pt-br
        dayjs.locale('pt-br')
    }, [])

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            {children}

            <ProgressBar
                height="10px"
                color="#9d4edd"
                options={{ showSpinner: false }}
                shallowRouting
            />

            <Toaster />
        </ThemeProvider>
    )
}