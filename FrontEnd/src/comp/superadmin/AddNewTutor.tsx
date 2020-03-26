import React from "react"
import { Modal, Icon, message, Spin } from "antd"
import { routerHistory } from "../.."
import { siteUrl, superAdminRoute } from "../../utilities"
import Axios from "axios"
import { ICorso } from "../../models/ICorso"
import { askPassword } from "../AskConferma"

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
                corso: corsi.length ? corsi[0].idCorso : 0
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

    aggiungiTutor = (e: any) => {
        e.preventDefault()

        const { nome, cognome, email, corso } = this.state

        if(nome.trim() === "" || cognome.trim() === "" || email === ""){
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

        askPassword(siteUrl+"/api/coordinatori", "post", {
            coordinatore: {
                nome: nome.trim(),
                cognome: cognome.trim(),
                email: email,
                idCorso: corso
            }
        }, (_: any) => {
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

        if(!listaCorsi.length){
            return <div className="col px-5 py-4 right-block" id="mainBlock">
                È necessario creare almeno un corso per poter inserire un nuovo coordinatore.
            </div>
        }

        return <div className="col px-5 py-4 right-block">
            <h3 className="mb-2 text-center">Aggiungi un nuovo coordinatore</h3>

            <form onSubmit={this.aggiungiTutor}>
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
                        <input name="email" type="email" className="form-control" value={email} onChange={this.changeEmail} />
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

                <button type="submit" className="btn btn-success text-uppercase w-100">Aggiungi coordinatore</button>
            </form>
        </div>
    }
}