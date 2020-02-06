export interface IStudent{
    readonly idStudente?: number
    readonly email: string
    readonly idCorso: number
    readonly nome: string
    readonly cognome: string
    readonly annoIscrizione: number
    readonly cf: string
    readonly password?: string
    readonly dataNascita: string
    readonly luogoNascita: string
    readonly code?: string
}