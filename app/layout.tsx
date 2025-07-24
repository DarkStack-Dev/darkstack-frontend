import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Layouts/Providers";
import { handleGetUser } from "@/lib/server/auth";
import { MainLayout } from "@/components/Layouts/MainLayout";
import NextTopLoader from 'nextjs-toploader';



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DarkStack",
  description: "Comunidade que vai revolucionar tudo que há de desenvolvimento em programação. A comunidade de progamadores feita para programadores.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  // return (
  //   <html lang="en">
  //     <body
  //       className={`${geistSans.variable} ${geistMono.variable} antialiased`}
  //     >
  //       {children}
  //     </body>
  //   </html>
  // );

  const user = await handleGetUser();
  return (
		<html lang="pt-br" suppressHydrationWarning>
			<body >
        <NextTopLoader />
				<Providers>
					<MainLayout user={user}>

						{children}
						
					</MainLayout>
        </Providers>
				
				
			</body>
		</html>
	);
}
