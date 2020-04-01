import { ILezione } from "./ILezione"
import { IStudenteAtLezione } from "./IStudenteAtLezione";

export interface ILezioneCorrente{
    readonly lezione: ILezione
    readonly studenti: IStudenteAtLezione[]
}