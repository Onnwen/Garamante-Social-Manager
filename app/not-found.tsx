export default function NotFound() {
    return (
        <main>
            <div className={"flex flex-col items-center justify-center space-y-5 mt-10 h-full"}>
                <h1 className={"text-3xl font-semibold text-zinc-700"}>Questa pagina non esiste.</h1>
                <p className={"text-2xl text-zinc-400"}>La pagina che stai cercando non esiste.</p>
            </div>
        </main>
    )
}
