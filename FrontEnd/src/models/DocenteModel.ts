export class Docente{

    public id: number
    public corso: number
    public nome: string
    public cognome: string

    constructor(corso: number, id: number, nome: string, cognome: string){
        this.corso = corso
        this.nome = nome
        this.cognome = cognome
        this.id = id
    }
}