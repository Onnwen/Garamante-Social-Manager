"use client"

import { Button, Card, Metric, Subtitle } from "@tremor/react"
import Link from "next/link"
import { BanknotesIcon, WrenchScrewdriverIcon, PaperAirplaneIcon, UserIcon } from "@heroicons/react/24/outline"
import { usePathname } from "next/navigation"
import { AnimatePresence, LayoutGroup, motion } from "framer-motion"
import React from "react"

export default function Logo() {
    const pathname = usePathname()

    const [showLogoInNavbar, setShowLogoInNavbar] = React.useState(false)

    const pages = [
        {
            name: "Pubblica",
            icon: PaperAirplaneIcon,
            path: "/pubblica",
        },
        {
            name: "Come funziona?",
            icon: WrenchScrewdriverIcon,
            path: "/funzionamento",
        },
        {
            name: "Prezzi",
            icon: BanknotesIcon,
            path: "/prezzi",
        },
        {
            name: "Account",
            icon: UserIcon,
            path: "/account",
        },
    ]

    return (
        <>
            <motion.div onViewportLeave={() => setShowLogoInNavbar(true)} onViewportEnter={() => setShowLogoInNavbar(false)}>
                <Link href={"/"}>
                    <Metric className={"font-regular text-zinc-700 dark:text-zinc-100"}>Garamante Social Manager</Metric>
                    <Subtitle className={`text-zinc-400 dark:text-zinc-400 font-medium transition duration-200 ease-in-out ${pathname === "/" ? "text-blue-500" : "text-zinc-400"} pb-5 mt-2`}>Ogni click, ogni post, ogni condivisione: GSM è qui, per te.</Subtitle>
                </Link>
            </motion.div>
            <div className={`pt-5 pb-10 ${showLogoInNavbar ? "block" : "hidden"}`}>
                <div className={"h-10"}></div>
            </div>
            <div className={`pt-5 pb-10 z-50 w-full ${showLogoInNavbar ? "fixed top-0 container" : ""}`}>
                <Card className={`flex flex-row h-10 space-x-8 items-center overflow-hidden w-full bg-white/75 backdrop-blur-2xl`}>
                    <LayoutGroup>
                        <AnimatePresence mode={"popLayout"}>
                            {showLogoInNavbar && (
                                <motion.div key="navLogo" layoutId={"navLogo"} layout={true} initial={{ opacity: 0, x: "-100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ type: "spring", damping: 15, duration: 5 }}>
                                    <Link href={"/"}>
                                        <p className={`font-semibold text-lg tracking-wider transition duration-200 ease-in-out opacity-90 ${pathname === "/" ? "text-blue-500" : "text-zinc-500"}`}>GSM</p>
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <motion.div key={"navButtons"} layout={true} className={"w-full"} transition={{ type: "spring", damping: 15 }}>
                            <div className={"flex flex-row space-x-8 w-full"}>
                                <Button icon={PaperAirplaneIcon} variant={"light"} color={pathname === "/pubblica" ? "blue" : "zinc"} className={"transition duration-200 ease-in-out"}>
                                    <Link href={"/pubblica"}>Pubblica</Link>
                                </Button>

                                <Button icon={WrenchScrewdriverIcon} variant={"light"} color={pathname === "/funzionamento" ? "blue" : "zinc"} className={"transition duration-200 ease-in-out"}>
                                    <Link href={"/funzionamento"}>Come funziona?</Link>
                                </Button>

                                <Button icon={BanknotesIcon} variant={"light"} color={pathname === "/prezzi" ? "blue" : "zinc"} className={"transition duration-200 ease-in-out"}>
                                    <Link href={"/prezzi"}>Prezzi</Link>
                                </Button>

                                <div className={"flex-grow"}></div>

                                <Button icon={UserIcon} variant={"light"} color={pathname === "/account" ? "blue" : "zinc"} className={"transition duration-200 ease-in-out"}>
                                    <Link href={"/account"}>Account</Link>
                                </Button>
                            </div>
                        </motion.div>
                    </LayoutGroup>
                </Card>
            </div>
        </>
    )
}
