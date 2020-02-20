export interface IPresenze{
    readonly idPresenza: number
    readonly data: string
    readonly ingresso: string
    readonly uscita: string
    readonly lezione: string
    readonly idLezione?: number
    readonly idStudente: number
    readonly anno?: number // SOLO PER DOCENTE
}