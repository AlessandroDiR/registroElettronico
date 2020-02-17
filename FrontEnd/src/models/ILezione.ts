import { IStudent } from "./IStudent";

export interface ILezione{
    readonly idLezione: number
    readonly data: string
    readonly inizio: string
    readonly fine: string
    readonly frequentata: IStudent[]
    readonly idCorso: number
}