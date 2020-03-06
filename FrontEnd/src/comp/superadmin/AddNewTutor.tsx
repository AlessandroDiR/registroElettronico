import React from "react"
import { Modal, Icon, message, Spin } from "antd"
import { routerHistory } from "../.."
import { siteUrl, superAdminRoute } from "../../utilities"
import Axios from "axios"
import { ICorso } from "../../models/ICorso"

export interface IProps{}
export interface IState{
    readonly nome: string
    readonly cognome: string
    readonly email: string
    readonly listaCorsi: ICorso[]
    readonly corso: number
}

export default class AddNewTutor extends React.PureComponent<IProps, IState>{

    constructor(props: IProps){
        super(props)

        this.state = {
            nome: "",
            cognome: "",
            email: "",
            listaCorsi: null,
            corso: null
        }
    }

    componentDidMount = () => {
        Axios.get(siteUrl+"/api/corsi").then(response => {
            let corsi = response.data as ICorso[]

            this.setState({
                listaCorsi: corsi,
                corso: corsi[0].idCorso
            })
        })
    }

    changeNome = (event: any) => {
        let nome = event.target.value

        this.setState({
            nome: nome
        })
    }

    changeCognome = (event: any) => {
        let cognome = event.target.value

        this.setState({
            cognome: cognome
        })
    }

    changeEmail = (event: any) => {
        let email = event.target.value.trim()

        this.setState({
            email: email
        })
    }

    changeCorso = (event: any) => {
        let corso = parseInt(event.target.value)

        this.setState({
            corso: corso
        })
    }

    isExistingCorso = (corso: number) => {
        return this.state.listaCorsi.find(c => c.idCorso === corso)
    }

    aggiungiTutor = () => {
        const { nome, cognome, email, corso } = this.state

        if(nome === "" || cognome === "" || email === ""){
            Modal.error({
                title: "Errore!",
                content: "Riempire tutti i campi."
            })

            return
        }

        if(!this.isExistingCorso(corso)){
            Modal.error({
                title: "Errore!",
                content: "Corso non valido."
            })

            return
        }

        Axios.post(siteUrl+"/api/coordinatori", {
            nome: nome.trim(),
            cognome: cognome.trim(),
            email: email,
            idCorso: corso
        }).then(_ => {
            message.success("Tutor creato con successo!")
            routerHistory.push(superAdminRoute+"/tutor")
        })

    }

    render(): JSX.Element{
        const { nome, cognome, email, listaCorsi } = this.state

        if(!listaCorsi){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />

            return <div className="col px-5 py-4 right-block" id="mainBlock">
                <Spin indicator={icon} />
            </div>
        }

        return <div className="col px-5 py-4 right-block">
            <h3 className="mb-2 text-center">Aggiungi un nuovo coordinatore</h3>

            <form>
                <div className="form-group row">
                    <div className="col">
                        <label className="text-secondary">Nome</label>
                        <input name="name" type="text" className="form-control" value={nome} onChange={this.changeNome} />
                    </div>
                    <div className="col">
                        <label className="text-secondary">Cognome</label>
                        <input name="surname" type="text" className="form-control" value={cognome} onChange={this.changeCognome} />
                    </div>
                </div>
                
                <div className="form-group row">
                    <div className="col">
                        <label className="text-secondary">E-mail</label>
                        <input name="email" type="text" className="form-control" value={email} onChange={this.changeEmail} />
                    </div>
                    <div className="col">
                        <label className="text-secondary">Corso gestito</label>
                        <select name="anno" onChange={this.changeCorso} className="custom-select">
                            {
                                listaCorsi.map(c => {
                                    return <option value={c.idCorso}>{c.nome}</option>
                                })
                            }
                        </select>
                    </div>
                </div>

                <button type="button" className="btn btn-success text-uppercase w-100" onClick={this.aggiungiTutor}>Aggiungi coordinatore</button>
            </form>
        </div>
    }
}