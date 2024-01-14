"use client"

import React from "react"
import Process from "@/app/funzionamento/components/process"
import Privacy from "@/app/funzionamento/components/privacy"
import APIExplanation from "@/app/funzionamento/components/api"

export default function More() {
    return (
        <main className={"space-y-14"}>
            <Privacy />
            <Process />
            <APIExplanation />
        </main>
    )
}
