export interface IPresenze{
    readonly id: number
    readonly data: string
    entrata: string
    uscita: string
    readonly lezione: string
    readonly anno?: number // SOLO PER DOCENTE
}