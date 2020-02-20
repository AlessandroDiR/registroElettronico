export interface IAdmin{
    readonly idCorso: number
    readonly nome: string
    readonly cognome: string
}
export const isAdmin = (obj: any) => {
    try{
        return "idCorso" in obj && "nome" in obj && "cognome" in obj;
    }catch{
        return false;
    }
}