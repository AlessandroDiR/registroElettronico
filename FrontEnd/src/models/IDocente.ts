export interface IDocente{
    readonly idDocente: number
    readonly email: string
    readonly corso: number
    readonly nome: string
    readonly cognome: string
    readonly cf: string
    readonly dataNascita: string
    readonly luogoNascita: string
    readonly materie: number[]
    readonly corsi: number[]
    readonly password?: string
}