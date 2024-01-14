import { Button } from "@tremor/react"
import { CogIcon } from "@heroicons/react/24/outline"

export default function Header() {
    return (
        <div className={"flex flex-row items-center space-x-2"}>
            <div className={"flex-1 text-left"}>
                <p className={"font-medium"}>Pubblica un nuovo post</p>
                <p className={"text-sm text-zinc-400"}>Il tuo post sarà pubblicato su tutte le piattaforme selezionate.</p>
            </div>
            <div className={"flex flex-row items-center space-x-2"}>
                <Button icon={CogIcon} variant="light" color={"zinc"}>
                    Impostazioni
                </Button>
            </div>
        </div>
    )
}
