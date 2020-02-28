export interface IPresenze{
    readonly idPresenza: number
    readonly idStudente: number
    readonly idLezione: number
    readonly data: string
    readonly lezione: string
    readonly ingresso: string
    readonly uscita: string
}