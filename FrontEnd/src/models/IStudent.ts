export interface IStudent{
    readonly id?: number
    readonly email: string
    readonly corso: number
    readonly nome: string
    readonly cognome: string
    readonly anno: number
    readonly cf: string
    readonly dataNascita: string
    readonly luogoNascita: string
    readonly code?: string
}