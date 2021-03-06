export interface IStudent{
    readonly idStudente?: number
    readonly email: string
    readonly idCorso: number
    readonly nome: string
    readonly cognome: string
    readonly annoFrequentazione: number
    readonly cf: string
    readonly password?: string
    readonly dataNascita: string
    readonly codice?: string
    readonly ritirato?: boolean
    readonly dataRitiro?: string
    readonly giornate?: number
    readonly frequenza?: number
    readonly promosso?: boolean
    readonly firmato?: boolean
}

export const isStudent = (obj: any) => {
    try{
        return "nome" in obj && "cognome" in obj && "idStudente" in obj
    }
    catch{
        return false
    }
}

export const isAccessStudent = (obj: any) => {
    try{
        return "nome" in obj && "cognome" in obj && "idStudente" in obj && "password" in obj && "idCorso" in obj && "annoFrequentazione" in obj && "codice" in obj
    }
    catch{
        return false
    }
}

export const areStudent = (obj: any) => {
    try{
        obj.forEach((s: any) => {
            if(!isStudent(s))
                return false
        })

        return true
    }
    catch{
        return false
    }
}