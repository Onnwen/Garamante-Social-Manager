import { Card } from "@tremor/react"
import React from "react"

export default function Process() {
    return (
        <div className={"space-y-3"}>
            <div className={"text-left"}>
                <p className={"font-medium"}>Processo di pubblicazione</p>
                <p className={"text-sm text-zinc-400"}>GSM pubblica comunicando con le API delle piattaforme social.</p>
            </div>
            <Card>
                <div className={"flex flex-row space-x-20"}>
                    <div className={"flex flex-col flex-1"}>
                        <p className={"font-medium text-6xl text-blue-500 mb-3"}>1</p>
                        <p className={"font-medium"}>Scrivi</p>
                        <p className={"text-sm text-zinc-400"}>Scrivi o incolli il tuo post su GSM, aggiungendo eventuali immagini.</p>
                    </div>

                    <div className={"flex flex-col flex-1"}>
                        <p className={"font-medium text-6xl text-blue-500 mb-3"}>2</p>
                        <p className={"font-medium"}>GSM adatta gli attributi</p>
                        <p className={"text-sm text-zinc-400"}>Per esempio, alcune piattaforme non sopportano i video o il formato Markdown.</p>
                    </div>

                    <div className={"flex flex-col flex-1"}>
                        <p className={"font-medium text-6xl text-blue-500 mb-3"}>3</p>
                        <p className={"font-medium"}>GSM pubblica</p>
                        <p className={"text-sm text-zinc-400"}>GSM invia dal tuo browser le richieste API per pubblicare il tuo post.</p>
                    </div>

                    <div className={"flex flex-col flex-1"}>
                        <p className={"font-medium text-6xl text-blue-500 mb-3"}>4</p>
                        <p className={"font-medium"}>Conferma</p>
                        <p className={"text-sm text-zinc-400"}>GSM ti inoltra le risposte delle API, confermandoti l'avvenuta pubblicazione.</p>
                    </div>
                </div>
            </Card>
        </div>
    )
}
