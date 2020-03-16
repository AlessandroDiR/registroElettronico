export interface IPresenzaDocente{
    readonly idPresenza: number
    readonly idDocente: number
    readonly idLezione: number
    readonly data: string
    readonly lezione: string
    ingresso: string
    uscita: string
}