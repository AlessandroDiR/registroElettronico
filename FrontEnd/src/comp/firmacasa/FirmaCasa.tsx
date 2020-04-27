import React from "react"
import { Modal, Radio, Icon, Tooltip, Spin } from "antd"
import { mountLogin, unmountLogin, siteUrl, convertFromUTC } from "../../utilities"
import { IStudent } from "../../models/IStudent"
import LogoCorso from "../LogoCorso"
import { IMessage } from "../../models/IMessage"
import { askPassword } from "../AskConferma"
import Axios from "axios"
import { ILezione } from "../../models/ILezione"
import Footer from "../Footer"
import { routerHistory } from "../.."

export interface IProps{}
export interface IState{
    readonly studenti: IStudent[]
    readonly selectedStudente: IStudent
    readonly lezione: ILezione
    readonly noLezione: boolean
}

export default class FirmaCasa extends React.PureComponent<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {
            studenti: null,
            selectedStudente: null,
            lezione: null,
            noLezione: false
        }
    }

    componentDidMount = () => {
        mountLogin()
        this.caricaLezione()
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

        Axios.post(siteUrl+"/api/studenti/richiestacodice", selectedStudente.idStudente, {
            headers: {"Content-Type": "application/json"}
        }).then(_ => {
            askPassword(siteUrl+"/api/firmaremota/firmaremotastudente", "post", {
                idStudente: selectedStudente.idStudente
            }, (response: any) => {
                let popup = response.data as IMessage
    
                Modal.info({
                    title: popup.title,
                    content: <div style={{ marginLeft: 38 }}>{popup.message}</div>,
                    icon: <i className={"float-left mr-3 far "+popup.icon} style={{ color: popup.iconColor, fontSize: 22 }}/>,
                    maskClosable: false,
                    onOk: () => routerHistory.push("/")
                })
            }, null, "Inserisci il codice che ti abbiamo inviato per e-mail")
        })
    }

    firmaDocente = () => {
        const { lezione, studenti } = this.state

        Axios.post(siteUrl+"/api/docenti/richiestacodice", lezione.idDocente, {
            headers: {"Content-Type": "application/json"}
        }).then(_ => {
            askPassword(siteUrl+"/api/firmaremota/firmaremotadocente", "post", {
                idDocente: lezione.idDocente,
                idCorso: studenti[0].idCorso,
                anno: studenti[0].annoFrequentazione
            }, (response: any) => {
                let popup = response.data as IMessage
    
                Modal.info({
                    title: popup.title,
                    content: <div style={{ marginLeft: 38 }}>{popup.message}</div>,
                    icon: <i className={"float-left mr-3 far " + popup.icon} style={{ color: popup.iconColor, fontSize: 22 }}/>,
                    maskClosable: false,
                    onOk: () => routerHistory.push("/")
                })
            }, null, "Inserisci il codice che ti abbiamo inviato per e-mail")
        })
    }

    scegliStudente = (s: IStudent) => {
        this.setState({
            selectedStudente: s
        })
    }

    caricaLezione = () => {
        let studenti = JSON.parse(sessionStorage.getItem("confermaCasa")) as any[],
        temp = studenti[0]

        Axios.get(siteUrl+"/api/lezioni/"+temp.idCorso+"/"+temp.annoFrequentazione).then(response => {
            if(typeof(response.data) === "string"){
                this.setState({
                    noLezione: true,
                    studenti: studenti as IStudent[]
                })
            }else{
                let lezione = response.data as ILezione

                studenti.forEach((s, i) => {
                    Axios.get(siteUrl+"/api/presenze/checkentrata/" + lezione.idLezione+"/"+s.idStudente).then(response => {
                        let firmato = response.data as boolean
        
                        s.firmato = firmato

                        if(i === studenti.length - 1){
                            this.setState({
                                lezione: lezione,
                                studenti: studenti as IStudent[]
                            })
                        }
                    })
                })
            }
        })
    }

    render(): JSX.Element{
        const { studenti, selectedStudente, lezione, noLezione } = this.state

        if(!studenti){
            const icon = <Icon type="loading" style={{ fontSize: 50, color: "#fff" }} spin />

            return <div className="col-12 px-5 py-4 right-block" id="mainBlock">
                <Spin indicator={icon} />
            </div>
        }

        if(!studenti.length){
            return <div className="col-11 col-lg-4 mx-auto" id="loginBlock">
                <div className="w-100 bg-white p-3 rounded shadow">
                    <p className="text-muted m-0 text-center">
                        <i className="fa fa-ban fa-fw fa-lg text-danger"></i> Non è stato trovato nessuno studente.</p>
                </div>
            </div>
        }

        return <div className="col-11 col-lg-5 mx-auto" id="loginBlock">
            <div className="w-100">
                <div className="bg-white p-3 rounded shadow mx-auto mb-3 col-12 col-md-6 pos-lg-fixed">
                    {
                        lezione || (!lezione && noLezione) ? <div>
                            {
                                !noLezione ? <Tooltip title={lezione.titolo}>
                                    <h5 className="mb-0 text-truncate">{lezione.titolo}</h5>
                                </Tooltip> : <h5 className="mb-0 text-truncate">Non c'è lezione.</h5>
                            }
                            {
                                !noLezione && <small className="text-muted">{convertFromUTC(lezione.oraInizio)} - {convertFromUTC(lezione.oraFine)}</small>
                            }
                            
                            <button type="button" className="btn btn-blue w-100 text-uppercase mt-2" disabled={lezione === null && noLezione} onClick={this.firmaDocente}>
                                {
                                    lezione === null && !noLezione && <Icon type="loading" className="mr-2 loadable-btn" spin />
                                }

                                Firma docente
                            </button>
                        </div> : <Icon type="loading" spin style={{ fontSize: 23 }} />
                    }
                </div>

                <form className="w-100 bg-white p-3 rounded shadow" onSubmit={this.inviaFirma}>
                    <h3 className="d-inline-block">Firma studente</h3>
                    <LogoCorso idCorso={studenti[0].idCorso} forLogin={true} />

                    <div className="form-group">
                        <label className="text-secondary">Scegli lo studente</label>
                        <div className="multiselect form-control p-0">
                            {
                                studenti.map(s => {            
                                    let checked = selectedStudente === s,
                                    classname = checked ? "checked" : ""
                                    
                                    return <label className={"option "+classname}>
                                        <Radio className="mr-2" onChange={() => this.scegliStudente(s)} checked={checked} /> {s.nome} {s.cognome} {s.firmato && <Tooltip title="Devi ancora firmare l'uscita!">
                                            <i className="fa fa-exclamation-circle text-warning float-right" style={{ transform: "translateY(25%)" }}></i>
                                        </Tooltip>}
                                    </label>
                                })
                            }
                        </div>
                    </div>

                    <input type="submit" disabled={lezione === null && noLezione} value="Firma" className="btn btn-lg btn-success w-100 text-uppercase"/>
                </form>

                <Footer />
            </div>
        </div>
    }

}