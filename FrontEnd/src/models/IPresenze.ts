export interface IPresenze{
    readonly idPresenza: number
    readonly idStudente: number
    readonly idLezione: number
    readonly data: string
    readonly lezione: string
    ingresso: string
    uscita: string
}