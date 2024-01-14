import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import Logo from "@/app/components/logo"

const montserrat = Montserrat({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="it" className={"bg-zinc-50 dark:bg-slate-950"}>
            <body className={`${montserrat.className} container mx-auto text-center my-14 min-h-screen`}>
                <Logo />
                {children}
            </body>
        </html>
    )
}
