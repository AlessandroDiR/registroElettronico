export interface IAdmin{
    readonly idCoordinatore?: number
    readonly idAmministratore?: number
    readonly idCorso: number
    readonly nome: string
    readonly cognome: string
    readonly codiceCorso?: string
    readonly password?: string
}
export const isAdmin = (obj: any) => {
    try{
        return "idCorso" in obj && "nome" in obj && "cognome" in obj
    }catch{
        return false
    }
}
export const isSuperAdmin = (obj: any) => {
    try{
        return "nome" in obj && "cognome" in obj
    }catch{
        return false
    }
}