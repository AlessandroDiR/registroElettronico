import React from "react"
import { IDocente } from "../../models/IDocente"
import { routerHistory } from "../.."
import { Modal, Tooltip, Spin, Icon, Switch, message } from "antd"
import Axios from "axios"
import { siteUrl, adminRoute } from "../../utilities"
import { askPassword } from "../AskConferma"

export interface IProps{
    readonly corso: number
}
export interface IState{
    readonly docenti: IDocente[]
    readonly showAll: boolean
}

export default class DocentiList extends React.PureComponent<IProps, IState>{

    constructor(props: IProps){
        super(props)

        this.state = {
            docenti: null,
            showAll: false
        }
    }

    componentDidMount = () => {
        Axios.get(siteUrl+"/api/docenti").then(response => {
            this.setState({
                docenti: response.data as IDocente[]
            })
        })
    }

    switchList = () => {
        this.setState({
            showAll: !this.state.showAll
        })
    }

    showDeleteConfirm = (docente: IDocente) => {
        Modal.confirm({
            title: `ATTENZIONE: si sta per ritirare un docente (${docente.nome} ${docente.cognome})`,
            content: "I dati identificativi del docente, le lezioni e le presenze verranno comunque mantenuti, ma il docente verrà ritirato da tutti i corsi in cui insegna. In seguito sarà possibile reintegrarlo nel corso se necessario.",
            okText: "Confermo",
            okType: "danger",
            cancelText: "Annulla",
            onOk: () => this.ritiraOAnnulla(docente.idDocente, "Docente ritirato con successo!")
        })
    }

    ritiraOAnnulla = (idDocente: number, msg: string) => {
        askPassword(siteUrl+"/api/docenti/ritiradocente", "put", {
            idDocente: idDocente
        }, (response: any) => {

            let docenti = response.data as IDocente[]

            this.setState({
                docenti: docenti
            })

            message.success(msg)
        }, () => {
            this.setState({
                docenti: null
            })
        })
    }

    sortbyId = (a: IDocente, b: IDocente) => { 
        if(a.idDocente > b.idDocente)
            return 1
        if(a.idDocente < b.idDocente)
            return -1

        return 0
    }

    backRetire = (doc: IDocente) => {
        Modal.confirm({
            title: `${doc.nome} ${doc.cognome}`,
            content: "Questo docente verrà reintegrato all'interno del corso.",
            okText: "Confermo",
            okType: "danger",
            cancelText: "Annulla",
            onOk: () => this.ritiraOAnnulla(doc.idDocente, "Docente reintegrato con successo!")
        })
    }

    isInCorso = (doc: IDocente) => {
        return doc.corsi.indexOf(this.props.corso) !== -1
    }

    render(): JSX.Element{
        const { docenti, showAll } = this.state

        if(!docenti){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />

            return <div className="col px-5 py-4 right-block" id="mainBlock">
                <Spin indicator={icon} />
            </div>
        }

        let lista = showAll ? docenti : docenti.filter(d => this.isInCorso(d)),
        docs = lista.sort(this.sortbyId).sort((a, _) => a.ritirato ? 0 : -1)

        return <div className="col px-5 py-4 right-block">
            <h3 className="mb-3 text-center">Docenti del corso</h3>

            <label className="pointer" style={{ transform: "translateY(50%)" }}>
                <Switch checked={!showAll} onChange={this.switchList} className="mr-1 align-top" /> Mostra solo i docenti del mio corso
            </label>

            <button className="btn btn-success float-right mb-3" type="button" onClick={() => routerHistory.push(adminRoute+"/docenti/new")}>
                <i className="fal fa-plus fa-fw"></i> Aggiungi docente
            </button>

            <table className="table table-bordered text-center">
                
                    <tbody>
                        <tr>
                            <th style={{width: "35%"}}>Docente</th>
                            <th style={{width: "15%"}}>Ore 1° anno</th>
                            <th style={{width: "15%"}}>Ore 2° anno</th>
                            <th style={{width: "20%"}}>Azioni</th>
                        </tr>

                        {
                            docs.map(d => {   
                                let bg = d.ritirato ? "light font-italic" : !this.isInCorso(d) ? "transblue" :"white"

                                return <tr className={"bg-"+bg}>
                                    <Tooltip title={d.nome + " " + d.cognome}>
                                        <td style={{maxWidth: 0}} className="text-truncate">{d.nome} {d.cognome}</td>
                                    </Tooltip>
                                    <td style={{maxWidth: 0}} className="text-truncate">{d.monteOre.orePrimo}</td>
                                    <td style={{maxWidth: 0}} className="text-truncate">{d.monteOre.oreSecondo}</td>
                                    <td>
                                        <Tooltip title="Dettagli">
                                            <button type="button" className="btn btn-info circle-btn" onClick={() => routerHistory.push(adminRoute+"/docenti/" + d.idDocente)}>
                                                <i className="fa fa-info"></i>
                                            </button>
                                        </Tooltip>

                                        {
                                            !d.ritirato && <Tooltip title="Modifica">
                                                <button type="button" className="btn btn-warning text-white circle-btn ml-2" onClick={() => routerHistory.push(adminRoute+"/docenti/edit/" + d.idDocente)}>
                                                    <i className="fa fa-pen"></i>
                                                </button>
                                            </Tooltip>
                                        }
                                        
                                        {
                                            !d.ritirato && <Tooltip title="Segna come ritirato">
                                                <button type="button" className="btn btn-danger circle-btn ml-2" onClick={() => this.showDeleteConfirm(d)}>
                                                    <i className="fa fa-user-times"></i>
                                                </button>
                                            </Tooltip>
                                        }

                                        {
                                            d.ritirato && <Tooltip title="Reintegra nel corso">
                                                <button type="button" className="btn btn-danger circle-btn ml-2" onClick={() => this.backRetire(d)}>
                                                    <i className="fa fa-reply"></i>
                                                </button>
                                            </Tooltip>
                                        }
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
            </table>
        </div>
    }
}