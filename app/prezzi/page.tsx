"use client"

import React from "react"
import Compatibility from "@/app/prezzi/compatibily"
import Pricing from "@/app/prezzi/pricing"

export default function More() {
    return (
        <main className={"space-y-14"}>
            <Pricing />
            <Compatibility />
        </main>
    )
}
