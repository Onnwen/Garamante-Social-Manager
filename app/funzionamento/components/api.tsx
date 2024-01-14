import { Card, Metric, Text } from "@tremor/react"
import React from "react"

export default function APIExplanation() {
    return (
        <div className={"space-y-3"}>
            <div className={"text-left"}>
                <p className={"font-medium"}>Cos'è un'API?</p>
                <p className={"text-sm text-zinc-400"}>Per funzionare, GSM comunica con le API delle piattaforme social.</p>
            </div>
            <Card className={"space-y-2"}>
                <Metric className={"text-blue-500 mb-3"}>/ˌeɪ piː ˈaɪ/</Metric>
                <Text>
                    Acronimo di <span className={"font-medium text-zinc-500"}>Application Programming Interface</span>, un'API è portinaio ufficiale messo a disposizione da un servizio per permettere a terzi di comunicare con esso. Nel caso dei social network, le API permettono di pubblicare post, caricare immagini e leggere i post di un utente.
                </Text>
                <Text>Immagina un ristorante dove i clienti ordinano varie pietanze. In questo caso, l'API è come il cameriere che prende gli ordini e li comunica in cucina. Quando GSM vuole interagire con un social network, per pubblicare un post o caricare una foto, invia la sua "ordinazione" tramite l'API, proprio come un cliente ordina un pasto al cameriere. Il cameriere si assicura che l'ordine venga eseguito correttamente in cucina e poi porta il piatto finito, o in questo caso, pubblica il post o l'immagine sul social network.</Text>
            </Card>
        </div>
    )
}
