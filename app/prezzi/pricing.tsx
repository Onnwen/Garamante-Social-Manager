import { Button, Card, Dialog, DialogPanel, Icon, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Title, Text } from "@tremor/react"
import { CheckIcon, QuestionMarkCircleIcon, XMarkIcon } from "@heroicons/react/24/outline"
import React from "react"

export default function Compatibility() {
    const [isOpenThread, setIsOpenThread] = React.useState(false)
    const [isOpenArchive, setIsOpenArchive] = React.useState(false)
    const [isOpenWidget, setIsOpenWidget] = React.useState(false)

    const data = [
        {
            name: "Post testuali",
            start: true,
            access: true,
            unbounded: true,
        },
        {
            name: "Su più piattaforme in contemporanea",
            start: false,
            access: true,
            unbounded: true,
        },
        {
            name: "Modalità thread",
            start: false,
            access: true,
            unbounded: true,
            setIsOpen: () => setIsOpenThread(true),
        },
        {
            name: "Post con media",
            start: false,
            access: false,
            unbounded: true,
        },
        {
            name: "Archiviazione automatica",
            start: false,
            access: false,
            unbounded: true,
            setIsOpen: () => setIsOpenArchive(true),
        },
        {
            name: "Widget pubblicazioni",
            start: false,
            access: false,
            unbounded: true,
            setIsOpen: () => setIsOpenWidget(true),
        },
    ]

    return (
        <div className={"space-y-3"}>
            <div className={"text-left"}>
                <p className={"font-medium"}>Piani di sottoscrizione</p>
                <p className={"text-sm text-zinc-400"}>Scegli il piano che più si adatta alle tue esigenze.</p>
            </div>
            <Card>
                <Table className={"table-fixed"}>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell></TableHeaderCell>
                            <TableHeaderCell className={"text-center dark:text-zinc-200"}>Senza autenticazione</TableHeaderCell>
                            <TableHeaderCell className={"text-center dark:text-zinc-200"}>GSM Access</TableHeaderCell>
                            <TableHeaderCell className={"text-center dark:text-zinc-200"}>GSM Unbounded</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.name}>
                                <TableCell className={"dark:text-zinc-200"}>
                                    <div className={"flex items-center"}>
                                        {item.name} {item.setIsOpen && <Button onClick={item.setIsOpen} variant={"light"} icon={QuestionMarkCircleIcon} size={"xs"} className={"ms-2"}></Button>}
                                    </div>
                                </TableCell>
                                <TableCell className={"text-center"}>{typeof item.start == "boolean" ? item.start ? <Icon icon={CheckIcon}></Icon> : <Icon icon={XMarkIcon} color={"zinc"}></Icon> : "coi"}</TableCell>
                                <TableCell className={"text-center"}>{typeof item.access == "boolean" ? item.access ? <Icon icon={CheckIcon}></Icon> : <Icon icon={XMarkIcon} color={"zinc"}></Icon> : "coi"}</TableCell>
                                <TableCell className={"text-center"}>{typeof item.unbounded == "boolean" ? item.unbounded ? <Icon icon={CheckIcon}></Icon> : <Icon icon={XMarkIcon} color={"zinc"}></Icon> : "coi"}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell className={"dark:text-zinc-200"}>Prezzo</TableCell>
                            <TableCell className={"text-center dark:text-zinc-200"}>Gratuito</TableCell>
                            <TableCell className={"text-center dark:text-zinc-200"}>
                                <div>
                                    <p className={"text-md dark:text-zinc-200"}>Gratuito</p>
                                    <p className={"text-zinc-400 text-xs"}>registrazione necessaria</p>
                                </div>
                            </TableCell>
                            <TableCell className={"text-center dark:text-zinc-200"}>
                                <div>
                                    <p className={"text-md dark:text-zinc-200"}>5€</p>
                                    <p className={"text-zinc-400 text-xs"}>al mese</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Card>

            <Dialog open={isOpenThread} onClose={(val) => setIsOpenThread(val)} static={true}>
                <DialogPanel>
                    <Title className="mb-3">Modalità thread</Title>
                    <Text className={"mb-2"}>Questa funzionalità permette di indicare a GSM di pubblicare un post come risposta ad un altro post.</Text>
                    <Text>GSM può identificare automaticamente l'ultimo post pubblicato, concatenando i post in un thread. In alternativa, è possibile indicare manualmente il post a cui rispondere.</Text>
                    <div className="mt-3">
                        <Button variant="light" onClick={() => setIsOpenThread(false)}>
                            Ho capito!
                        </Button>
                    </div>
                </DialogPanel>
            </Dialog>

            <Dialog open={isOpenArchive} onClose={(val) => setIsOpenArchive(val)} static={true}>
                <DialogPanel>
                    <Title className="mb-3">Archiazione automatica</Title>
                    <Text className={"mb-2"}>GSM può archiviare automaticamente i post pubblicati tramite di esso. Ciò permette di mantenere un archivio completo di tutti i post pubblicati, senza doverli archiviare manualmente.</Text>
                    <div className="mt-3">
                        <Button variant="light" onClick={() => setIsOpenArchive(false)}>
                            Ho capito!
                        </Button>
                    </div>
                </DialogPanel>
            </Dialog>

            <Dialog open={isOpenWidget} onClose={(val) => setIsOpenWidget(val)} static={true}>
                <DialogPanel>
                    <Title className="mb-3">Widget pubblicazioni</Title>
                    <Text className={"mb-2"}>GSM mette a disposizione un widget che permette di visualizzare le pubblicazioni effettuate tramite di esso.</Text>
                    <Text> Funziona come un embed, similare a quello di Twitter, con la differenza che è possibile personalizzare il widget in base alle proprie piattaforme mostrando sinuosamente tutti i post pubblicati, a prescindere dalla piattaforma.</Text>
                    <div className="mt-3">
                        <Button variant="light" onClick={() => setIsOpenWidget(false)}>
                            Ho capito!
                        </Button>
                    </div>
                </DialogPanel>
            </Dialog>
        </div>
    )
}
