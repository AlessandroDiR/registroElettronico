export interface IDocente{
    readonly idDocente: string
    readonly email: string
    readonly nome: string
    readonly cognome: string
    readonly cf: string
    readonly materie: number[]
    readonly corsi: number[]
    readonly password?: string
    readonly ritirato?: boolean
    readonly monteOre?: number
}