"use client"

import { Button } from "@tremor/react"
import { PaperClipIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { AnimatePresence } from "framer-motion"

export default function PlatformsSelection({ platforms, setPlatforms, insertMediaWindow, setInsertMediaWindows }: { platforms: Array<Platform>; setPlatforms: Function; insertMediaWindow: boolean; setInsertMediaWindows: Function }) {
    return (
        <div className={"flex flex-row items-center pb-5"}>
            <div className={"flex flex-row space-x-2 flex-1"}>
                {platforms.map((platform) => (
                    <Button
                        className={`flex flex-row space-y-2 items-center`}
                        style={platform.isActive ? { backgroundColor: platform.color, borderWidth: "1px", borderStyle: "solid", borderRadius: "0.375rem", borderColor: platform.color } : {}}
                        size="xs"
                        color={"zinc"}
                        key={platform.name}
                        variant={platform.isActive ? "primary" : "secondary"}
                        onClick={() => {
                            const newPlatforms = platforms.map((item) => {
                                if (item.name === platform.name) {
                                    item.isActive = !item.isActive
                                }
                                return item
                            })
                            setPlatforms(newPlatforms)
                        }}>
                        {platform.name} <i className={`bi-${platform.icon} ms-1 !text-[${platform.color}]`}></i>
                    </Button>
                ))}
            </div>
            <AnimatePresence mode={"wait"}>
                <Button icon={insertMediaWindow ? XMarkIcon : PaperClipIcon} variant="light" onClick={() => setInsertMediaWindows(!insertMediaWindow)}>
                    {insertMediaWindow ? "Chiudi" : "Allega"}
                </Button>
            </AnimatePresence>
        </div>
    )
}
