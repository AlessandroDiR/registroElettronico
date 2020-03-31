import { ILezione } from "./ILezione"
import { IStudent } from "./IStudent"

export interface ILezioneCorrente{
    readonly lezione: ILezione
    readonly studenti: IStudent[]
}