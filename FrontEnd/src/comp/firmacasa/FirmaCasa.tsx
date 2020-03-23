import React from "react"
import { Modal, Radio } from "antd"
import { mountLogin, unmountLogin, siteUrl } from "../../utilities"
import { IStudent } from "../../models/IStudent"
import LogoCorso from "../LogoCorso"
import { IMessage } from "../../models/IMessage"
import { askPassword } from "../AskConferma"
import Axios from "axios"

export interface IProps{}
export interface IState{
    readonly studenti: IStudent[]
    readonly selectedStudente: IStudent
}

export default class FirmaCasa extends React.PureComponent<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {
            studenti: JSON.parse(sessionStorage.getItem("confermaCasa")) as IStudent[],
            selectedStudente: null
        }
    }

    componentDidMount = () => {
        mountLogin()
    }

    componentWillUnmount = () => {
        unmountLogin()
    }

    inviaFirma = (e: any) => {
        e.preventDefault()

        const { selectedStudente } = this.state

        if(!selectedStudente){
            Modal.error({
                title: "Errore!",
                content: "Selezionare uno studente.",
                maskClosable: true
            })

            return
        }

        Axios.post(siteUrl+"/api/firmaremota/richiestacodice", selectedStudente.idStudente).then(_ => {
            askPassword(siteUrl+"/api/firmaremota", "post", {
                idStudente: selectedStudente.idStudente
            }, (response: any) => {
                let popup = response.data as IMessage
    
                Modal.info({
                    title: popup.title,
                    content: <div style={{ marginLeft: 38 }}>{popup.message}</div>,
                    icon: <i className={"float-left mr-3 far "+popup.icon} style={{ color: popup.iconColor, fontSize: 22 }}/>
                })
            }, null, "Inserisci il codice che ti abbiamo inviato per e-mail")
        })
    }

    scegliStudente = (s: IStudent) => {
        this.setState({
            selectedStudente: s
        })
    }

    render(): JSX.Element{
        const { studenti, selectedStudente } = this.state

        if(!studenti.length){
            return <div className="col-11 col-lg-4 mx-auto" id="loginBlock">
                <div className="w-100 bg-white p-3 rounded shadow">
                    <p className="text-muted m-0 text-center">
                        <i className="fa fa-ban fa-fw fa-lg text-danger"></i> Non è stato trovato nessuno studente.</p>
                </div>
            </div>
        }

        return <div className="col-11 col-lg-5 mx-auto" id="loginBlock">
            <form className="w-100 bg-white p-3 rounded shadow" onSubmit={this.inviaFirma}>
                <h3 className="d-inline-block">Firma da casa</h3>
                <LogoCorso idCorso={studenti[0].idCorso} forLogin={true} />

                <div className="form-group">
                    <label className="text-secondary">Scegli lo studente</label>
                    <div className="multiselect form-control p-0">
                        {
                            studenti.map(s => {
                                let checked = selectedStudente === s,
                                classname = checked ? "checked" : ""
                                
                                return <label className={"option "+classname}>
                                    <Radio className="mr-2" onChange={() => this.scegliStudente(s)} checked={checked} /> {s.nome} {s.cognome}
                                </label>
                            })
                        }
                    </div>
                </div>

                <input type="submit" value="Firma" className="btn btn-lg btn-success w-100 text-uppercase"/>
            </form>
        </div>
    }

}