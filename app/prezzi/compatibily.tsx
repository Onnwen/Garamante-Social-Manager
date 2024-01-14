import { Card, Icon, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@tremor/react"
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline"
import React from "react"

export default function Compatibility() {
    const data = [
        {
            name: "Twitter",
            text: true,
            media: true,
            thread: true,
        },
        {
            name: "Telegram",
            text: true,
            media: true,
            thread: false,
        },
        {
            name: "Facebook",
            text: true,
            media: false,
            thread: false,
        },
        {
            name: "Blue Sky",
            text: true,
            media: false,
            thread: false,
        },
        {
            name: "Instagram",
            text: false,
            media: false,
            thread: false,
        },
        {
            name: "Discord",
            text: false,
            media: false,
            thread: false,
        },
    ]

    return (
        <div className={"space-y-3"}>
            <div className={"text-left"}>
                <p className={"font-medium"}>Piattaforme compatibili</p>
                <p className={"text-sm text-zinc-400"}>Ci impegniamo costantemente per supportare nuove piattaforme.</p>
            </div>
            <Card>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell></TableHeaderCell>
                            <TableHeaderCell className={"text-center dark:text-zinc-200"}>Post testuali</TableHeaderCell>
                            <TableHeaderCell className={"text-center dark:text-zinc-200"}>Media</TableHeaderCell>
                            <TableHeaderCell className={"text-center dark:text-zinc-200"}>Thread</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.name}>
                                <TableCell className={"dark:text-zinc-200"}>{item.name}</TableCell>
                                <TableCell className={"text-center"}>{item.text ? <Icon icon={CheckIcon}></Icon> : <Icon icon={XMarkIcon} color={"zinc"}></Icon>}</TableCell>
                                <TableCell className={"text-center"}>{item.media ? <Icon icon={CheckIcon}></Icon> : <Icon icon={XMarkIcon} color={"zinc"}></Icon>}</TableCell>
                                <TableCell className={"text-center"}>{item.thread ? <Icon icon={CheckIcon}></Icon> : <Icon icon={XMarkIcon} color={"zinc"}></Icon>}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}
