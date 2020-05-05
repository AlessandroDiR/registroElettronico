import React from "react"
import { Modal, Icon, message, Spin } from "antd"
import { routerHistory } from "../.."
import { siteUrl, superAdminRoute } from "../../utilities"
import Axios from "axios"
import { ICorso } from "../../models/ICorso"
import { RouteComponentProps } from "react-router-dom"
import { ITutor } from "../../models/ITutor"
import { askPassword } from "../AskConferma"

export interface IRouteParams{
    readonly id: string
}
export interface IProps extends RouteComponentProps<IRouteParams>{}
export interface IState{
    readonly nome: string
    readonly cognome: string
    readonly email: string
    readonly listaCorsi: ICorso[]
    readonly corso: number
}

export default class EditTutor extends React.PureComponent<IProps, IState>{

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
        let id = Number(this.props.match.params.id)

        if(isNaN(id))
            routerHistory.push(superAdminRoute)

        Axios.get(siteUrl+"/api/coordinatori/"+id).then(response => {
            let tutor = response.data as ITutor

            this.setState({
                nome: tutor.nome,
                cognome: tutor.cognome,
                email: tutor.email,
                corso: tutor.idCorso
            })
        })

        Axios.get(siteUrl+"/api/corsi").then(response => {
            let corsi = response.data as ICorso[]

            this.setState({
                listaCorsi: corsi
            })
        })
    }

    changeNome = (event: any) => {
        let nome = event.target.value

        this.setState({
            nome
        })
    }

    changeCognome = (event: any) => {
        let cognome = event.target.value

        this.setState({
            cognome
        })
    }

    changeEmail = (event: any) => {
        let email = event.target.value.trim()

        this.setState({
            email
        })
    }

    changeCorso = (event: any) => {
        let corso = parseInt(event.target.value)

        this.setState({
            corso
        })
    }

    isExistingCorso = (corso: number) => {
        return this.state.listaCorsi.find(c => c.idCorso === corso)
    }

    modificaTutor = (e: any) => {
        e.preventDefault()

        const { nome, cognome, email, corso } = this.state
        const idCoordinatore = this.props.match.params.id

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

        askPassword(siteUrl+"/api/coordinatori/" + idCoordinatore, "put", {
            coordinatore: {
                idCoordinatore,
                nome: nome.trim(),
                cognome: cognome.trim(),
                email,
                idCorso: corso
            }
        }, (_: any) => {
            message.success("Tutor modificato con successo!")
            routerHistory.push(superAdminRoute+"/tutor")
        })
    }

    render(): JSX.Element{
        const { nome, cognome, email, listaCorsi, corso } = this.state

        if(!listaCorsi){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />

            return <div className="col px-5 py-4 right-block" id="mainBlock">
                <Spin indicator={icon} />
            </div>
        }

        return <div className="col px-5 py-4 right-block">
            <h3 className="mb-2 text-center">Modifica di un coordinatore</h3>

            <form onSubmit={this.modificaTutor}>
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
                                    let selected = corso === c.idCorso

                                    return <option value={c.idCorso} selected={selected}>{c.nome}</option>
                                })
                            }
                        </select>
                    </div>
                </div>

                <button type="submit" className="btn btn-success text-uppercase w-100">Modifica coordinatore</button>
            </form>
        </div>
    }
}