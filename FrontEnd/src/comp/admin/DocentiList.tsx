import React from "react"
import { IDocente } from "../../models/IDocente";
import { routerHistory } from "../..";
import { Modal, Tooltip, Spin, Icon, Switch, message } from "antd"
import Axios from "axios";
import { siteUrl, adminRoute } from "../../utilities";

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
        Axios.get(siteUrl+"/api/docenti").then((response) => {
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
        let context = this

        Modal.confirm({
            title: 'ATTENZIONE: si sta per ritirare un docente (' + docente.nome + ' ' + docente.cognome + ')',
            content: 'I dati identificativi del docente, le lezioni e le presenze verranno comunque mantenuti.',
            okText: 'Confermo',
            okType: 'danger',
            cancelText: 'Annulla',
            onOk() {
                let doc = docente as any
                doc.ritirato = "true"
                
                context.setState({
                    docenti: null
                })
                
                Axios.put(siteUrl+"/api/docenti/"+docente.idDocente, {
                    idDocente: docente.idDocente,
                    nome: docente.nome,
                    cognome: docente.cognome,
                    email: docente.email,
                    cf: docente.cf,
                    password: docente.password,
                    ritirato: docente.ritirato
                }).then(response => {

                    let docenti = response.data as IDocente[]

                    context.setState({
                        docenti: docenti
                    })

                    message.success("Docente ritirato con successo!")
                })
            }
        })
    }

    sortbyId = (a: IDocente, b: IDocente) => { 
        if(a.idDocente > b.idDocente)
            return 1
        if(a.idDocente < b.idDocente)
            return -1

        return 0
    }

    render(): JSX.Element{
        const { docenti, showAll } = this.state

        
        if(!docenti){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

            return <div className="col px-5 py-4 right-block" id="mainBlock">
                <Spin indicator={icon} />
            </div>
        }

        let lista = showAll ? docenti : docenti.filter(d => d.corsi.indexOf(this.props.corso) !== -1),
        docs = lista.sort(this.sortbyId).sort((a, _) => a.ritirato ? 0 : -1)

        return <div className="col px-5 py-4 right-block">
            <h3 className="mb-3 text-center">Docenti del corso</h3>

            <label className="pointer" style={{ transform: "translateY(50%)" }}>
                <Switch checked={!showAll} onChange={this.switchList} className="mr-1 align-top" /> Mostra solo i docenti del mio corso
            </label>

            <button className="btn btn-success float-right mb-3" type="button" onClick={() => routerHistory.push(adminRoute+"/docenti/new")}>
                <i className="fal fa-plus"></i> Aggiungi docente
            </button>

            <table className="table table-bordered text-center">
                
                    <tbody>
                        <tr>
                            <th>Nome</th>
                            <th>Cognome</th>
                            <th style={{width: "15%"}}>Monte ore</th>
                            <th style={{width: "20%"}}>Azioni</th>
                        </tr>

                        {
                            docs.map(d => {   
                                let bg = d.ritirato ? "light font-italic" : "white"     
                                return <tr className={"bg-"+bg}>
                                    <td style={{maxWidth: 0}} className="text-truncate">{d.nome}</td>
                                    <td style={{maxWidth: 0}} className="text-truncate">{d.cognome}</td>
                                    <td style={{maxWidth: 0}} className="text-truncate">{d.monteOre}</td>
                                    <td>
                                        <Tooltip title="Dettagli">
                                            <button type="button" className="btn btn-info circle-btn mr-2" onClick={() => routerHistory.push(adminRoute+"/docenti/" + d.idDocente)}>
                                                <i className="fa fa-info"></i>
                                            </button>
                                        </Tooltip>

                                        {
                                            !d.ritirato && <Tooltip title="Modifica">
                                                <button type="button" className="btn btn-warning text-white circle-btn mr-2" onClick={() => routerHistory.push(adminRoute+"/docenti/edit/" + d.idDocente)}>
                                                    <i className="fa fa-pen"></i>
                                                </button>
                                            </Tooltip>
                                        }
                                        
                                        {
                                            !d.ritirato && <Tooltip title="Segna come ritirato">
                                                <button type="button" className="btn btn-danger circle-btn" onClick={() => this.showDeleteConfirm(d)}>
                                                    <i className="fa fa-user-times"></i>
                                                </button>
                                            </Tooltip>
                                        }

                                        {
                                            d.ritirato && <Tooltip title="Docente ritirato">
                                                <button type="button" className="circle-btn ml-2 border-0">
                                                    <i className="fa fa-user-slash"></i>
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