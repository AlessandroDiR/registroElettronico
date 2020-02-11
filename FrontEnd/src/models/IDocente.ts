import { IMateria } from "./IMateria";

export interface IDocente{
    readonly idDocente: number
    readonly email: string
    readonly corso: number
    readonly nome: string
    readonly cognome: string
    readonly cf: string
    readonly dataNascita: string
    readonly luogoNascita: string
    readonly insegnare: IMateria[]
    readonly password?: string
}