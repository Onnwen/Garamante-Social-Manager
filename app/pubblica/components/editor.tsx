"use client"

import { Card } from "@tremor/react"
import { AnimatePresence, LayoutGroup, motion } from "framer-motion"
import React, { useEffect, useRef } from "react"
import { PaperClipIcon } from "@heroicons/react/24/outline"

export default function Editor({ insertMediaWindow }: { insertMediaWindow: boolean }) {
    const [insertMediaWindowsWidth, setInsertMediaWindowsWidth] = React.useState(0)

    return (
        <div className={"flex flex-row space-x-2 min-h-80 h-80 w-full"}>
            <LayoutGroup>
                <motion.div layout={true} transition={{ type: "spring", damping: 15 }} className={"w-full h-full"} key={"editor"}>
                    <Card className={"h-full"}>
                        <p>Ciao</p>
                    </Card>
                </motion.div>
                <AnimatePresence mode={"popLayout"}>
                    {insertMediaWindow && (
                        <motion.div initial={{ x: "100%", opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "100%", opacity: 0 }} className={"h-full"} layout={true} transition={{ type: "spring", damping: 15 }} key={"insertMediaWindow"}>
                            <Card className={"h-full"}>
                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-full border-2 border-zinc-300 border-dashed rounded-lg cursor-pointer bg-zinc-50 dark:hover:bg-zinc-800 dark:bg-slate-700 hover:bg-zinc-100 dark:border-slate-600 dark:hover:border-slate-500 p-10 text-center">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 my-auto">
                                        <PaperClipIcon className="w-12 h-12 text-gray-400" />
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 mt-2">
                                            <span className="font-semibold">Trascina</span> o clicca per selezionare
                                        </p>
                                    </div>
                                    <input id="dropzone-file" type="file" className="hidden" />
                                </label>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </LayoutGroup>
        </div>
    )
}
