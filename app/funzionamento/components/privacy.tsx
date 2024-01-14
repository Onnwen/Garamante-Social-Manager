import { Card, Metric, Title } from "@tremor/react"
import { ArchiveBoxIcon, LockClosedIcon, ShieldCheckIcon } from "@heroicons/react/24/outline"

export default function Privacy() {
    return (
        <div className={"space-y-3"}>
            <div className={"text-left"}>
                <p className={"font-medium"}>Sicurezza</p>
                <p className={"text-sm text-zinc-400"}>In nessun momento GSM ha accesso alle tue credenziali.</p>
            </div>
            <Card className={"text-center"}>
                <div className={"flex flex-row"}>
                    <div className={"flex flex-col flex-1"}>
                        <LockClosedIcon className={"h-12 w-12 mx-auto text-blue-500"} />
                        <p className={"font-medium mt-3"}>Le tue credenziali</p>
                        <p className={"text-sm text-zinc-400"}>Rimangono sempre nel browser, sul tuo dispositivo.</p>
                    </div>

                    <div className={"flex flex-col flex-1"}>
                        <ShieldCheckIcon className={"h-12 w-12 mx-auto text-blue-500"} />
                        <p className={"font-medium mt-3"}>Sotto al tuo controllo</p>
                        <p className={"text-sm text-zinc-400"}>Le richieste API partono dal tuo browser, quando decidi tu.</p>
                    </div>

                    <div className={"flex flex-col flex-1"}>
                        <ArchiveBoxIcon className={"h-12 w-12 mx-auto text-blue-500"} />
                        <p className={"font-medium mt-3"}>Archivio</p>
                        <p className={"text-sm text-zinc-400"}>
                            Con <span className={"font-medium text-zinc-500"}>GSM Unbounded</span> puoi archiviare al sicuro i tuoi post.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    )
}
