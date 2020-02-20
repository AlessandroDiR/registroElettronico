export interface IPresenzaDocente{
    readonly idPresenza: number
    readonly idDocente: number
    readonly idLezione: number
    readonly data: string
    readonly lezione: string
    readonly ingresso: string
    readonly uscita: string
}