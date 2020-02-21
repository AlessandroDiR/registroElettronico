import React from "react"
import { Modal, message } from "antd"
import { routerHistory } from "../.."
import { siteUrl } from "../../utilities"
import Axios from "axios"

export interface IProps{
    readonly corso: number
}
export interface IState{
    readonly nome: string
    readonly cognome: string
    readonly CF: string
    readonly email: string
}

export default class AddNewDocente extends React.PureComponent<IProps, IState>{

    constructor(props: IProps){
        super(props)

        this.state = {
            nome: "",
            cognome: "",
            CF: "",
            email: ""
        }
    }

    changeNome = (event: any) => {
        let nome = event.target.value

        this.setState({
            nome: nome
        })
    }

    changeEmail = (event: any) => {
        let email = event.target.value

        this.setState({
            email: email
        })
    }

    changeCognome = (event: any) => {
        let cognome = event.target.value

        this.setState({
            cognome: cognome
        })
    }

    changeCF = (event: any) => {
        let CF = event.target.value

        this.setState({
            CF: CF
        })
    }

    aggiungiDocente = () => {
        const { nome, cognome,CF, email } = this.state

        if(nome === "" || cognome === "" || CF === "" || email === ""){
            Modal.error({
                title: "Errore!",
                content: "Riempire tutti i campi."
            })

            return
        }

        if(CF.length !== 16){
            Modal.error({
                title: "Errore!",
                content: "Codice Fiscale non valido."
            })

            return
        }

        Axios.post(siteUrl+"/api/docenti", {
            nome: nome,
            cognome: cognome,
            cf: CF,
            password: CF,
            email: email,
            tenere: [],
            insegnare: []
        }).then(_ => {
            message.success("Docente creato con successo!")
            routerHistory.push("/adminpanel/docenti")
        })

    }

    render(): JSX.Element{
        const { nome, cognome, CF, email } = this.state

        return <div className="col-9 px-5 py-4 right-block">
            <h3 className="mb-2 text-center">Aggiungi un nuovo docente</h3>

            <form>
                <div className="form-group row">
                    <div className="col">
                        <label className="text-secondary">Nome</label>
                        <input type="text" className="form-control" value={nome} onChange={this.changeNome} />
                    </div>
                    <div className="col">
                        <label className="text-secondary">Cognome</label>
                        <input type="text" className="form-control" value={cognome} onChange={this.changeCognome} />
                    </div>
                </div>
                
                <div className="form-group row">
                    <div className="col">
                        <label className="text-secondary">E-mail</label>
                        <input type="email" className="form-control" value={email} onChange={this.changeEmail} />
                    </div>
                    <div className="col">
                        <label className="text-secondary">Codice Fiscale</label>
                        <input type="text" className="form-control" maxLength={16} value={CF} onChange={this.changeCF} />
                    </div>
                </div>

                <button type="button" className="btn btn-success text-uppercase w-100" onClick={this.aggiungiDocente}>Aggiungi docente</button>
            </form>
        </div>
    }
}