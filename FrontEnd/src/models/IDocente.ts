export interface IDocente{
    readonly idDocente: number
    readonly email: string
    readonly nome: string
    readonly cognome: string
    readonly cf: string
    readonly dataNascita: string
    readonly luogoNascita: string
    readonly materie: number[]
    readonly corsi: number[]
    readonly password?: string
    readonly ritirato?: boolean
}