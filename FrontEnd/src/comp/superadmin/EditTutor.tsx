import React from "react"
import { Modal, Icon, message, Spin } from "antd"
import { routerHistory } from "../.."
import { siteUrl, superAdminRoute } from "../../utilities"
import Axios from "axios"
import { ICorso } from "../../models/ICorso"
import { RouteComponentProps } from "react-router-dom"
import { ITutor } from "../../models/ITutor"

export interface IRouteParams{
    readonly id: string
}
export interface IProps extends RouteComponentProps<IRouteParams>{}
export interface IState{
    readonly nome: string
    readonly cognome: string
    readonly cf: string
    readonly listaCorsi: ICorso[]
    readonly corso: number
}

export default class EditTutor extends React.PureComponent<IProps, IState>{

    constructor(props: IProps){
        super(props)

        this.state = {
            nome: "",
            cognome: "",
            cf: "",
            listaCorsi: null,
            corso: null
        }
    }

    componentDidMount = () => {
        let id = Number(this.props.match.params.id)

        if(isNaN(id))
            routerHistory.push(superAdminRoute)

        Axios.get(siteUrl+"/api/tutor/"+id).then(response => {
            let tutor = response.data as ITutor

            this.setState({
                nome: tutor.nome,
                cognome: tutor.cognome,
                cf: tutor.cf,
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
            nome: nome
        })
    }

    changeCognome = (event: any) => {
        let cognome = event.target.value

        this.setState({
            cognome: cognome
        })
    }

    changeCF = (event: any) => {
        let cf = event.target.value

        this.setState({
            cf: cf
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
        const { nome, cognome, cf, corso } = this.state

        if(nome === "" || cognome === "" || cf === ""){
            Modal.error({
                title: "Errore!",
                content: "Riempire tutti i campi."
            })

            return
        }

        if(cf.length !== 16){
            Modal.error({
                title: "Errore!",
                content: "Codice Fiscale non valido."
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

        // TRIM DATI

        /*************************************************/
        /* CREAZIONE NUOVO CORSO E POI MOSTRARE MODAL    */
        /*************************************************/

        message.success("Tutor modificato con successo!")
        routerHistory.push(superAdminRoute+"/tutor")

    }

    render(): JSX.Element{
        const { nome, cognome, cf, listaCorsi, corso } = this.state

        if(!listaCorsi){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />

            return <div className="col px-5 py-4 right-block" id="mainBlock">
                <Spin indicator={icon} />
            </div>
        }

        return <div className="col px-5 py-4 right-block">
            <h3 className="mb-2 text-center">Modifica di un coordinatore</h3>

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
                        <label className="text-secondary">Codice Fiscale</label>
                        <input name="cf" type="text" className="form-control" maxLength={16} value={cf} onChange={this.changeCF} />
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

                <button type="button" className="btn btn-success text-uppercase w-100" onClick={this.aggiungiTutor}>Modifica coordinatore</button>
            </form>
        </div>
    }
}