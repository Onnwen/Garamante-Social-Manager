"use client"

import Editor from "@/app/pubblica/components/editor"
import { Button, Card, Divider, Flex, ProgressBar } from "@tremor/react"
import PlatformsSelection from "@/app/pubblica/components/platforms"
import { PaperAirplaneIcon } from "@heroicons/react/24/solid"
import Header from "@/app/pubblica/components/header"
import React, { useState } from "react"

export default function Home() {
    const [platforms, setPlatforms] = useState<Array<Platform>>([
        {
            name: "Twitter",
            icon: "twitter-x",
            colorName: "neutral",
            color: "#000000",
            isActive: true,
        },
        {
            name: "Telegram",
            icon: "telegram",
            colorName: "teal",
            color: "#0088cc",
            isActive: false,
        },
        {
            name: "Facebook",
            icon: "facebook",
            colorName: "blue",
            color: "#3b5998",
            isActive: false,
        },
        {
            name: "Blue Sky",
            icon: "app",
            colorName: "sky",
            color: "#007AFA",
            isActive: false,
        },
        {
            name: "Wordpress",
            icon: "wordpress",
            colorName: "blue",
            color: "#21759b",
            isActive: true,
        },
    ])

    const [insertMediaWindow, setInsertMediaWindows] = useState<boolean>(false)

    return (
        <main className={"space-y-3"}>
            <Header></Header>
            <Editor insertMediaWindow={insertMediaWindow}></Editor>
            <PlatformsSelection platforms={platforms} setPlatforms={setPlatforms} insertMediaWindow={insertMediaWindow} setInsertMediaWindows={setInsertMediaWindows}></PlatformsSelection>
            <Button className={"w-full mt-10"} icon={PaperAirplaneIcon} disabled={platforms.filter((platform) => platform.isActive).length === 0}>
                {platforms.filter((platform) => platform.isActive).length === 0 ? "Seleziona almeno una piattaforma" : platforms.filter((platform) => platform.isActive).length === 1 ? "Pubblica su " + platforms.filter((platform) => platform.isActive)[0].name : "Pubblica su " + platforms.filter((platform) => platform.isActive).length + " piattaforme"}
            </Button>
        </main>
    )
}
