export interface IAdminDocente{
    readonly idDocente: number
    readonly nome: string
    readonly cognome: string
}
export const isAdminDocente = (obj: any) => {
    return "idDocente" in obj && "nome" in obj && "cognome" in obj
}