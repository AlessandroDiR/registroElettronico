import React from "react"
import { IDocente } from "../../models/IDocente";
import { routerHistory } from "../..";
import { Modal, Tooltip, Spin, Icon } from "antd"
import Axios from "axios";
import { siteUrl } from "../../utilities";

export interface IProps{
    readonly corso: number
}
export interface IState{
    readonly docenti: IDocente[]
}

export default class DocentiList extends React.PureComponent<IProps, IState>{

    constructor(props: IProps){
        super(props)

        this.state = {
            docenti: null
        }
    }

    componentDidMount = () => {
        Axios.get(siteUrl+"/reg/api?docenti&corso=1").then((response) => {
            this.setState({
                docenti: response.data as IDocente[]
            })
        })
    }

    showDeleteConfirm = (student: IDocente) => {
        Modal.confirm({
            title: 'Confermi di voler eliminare questo docente dal corso? (' + student.nome + ' ' + student.cognome + ')',
            content: 'Insieme al docente verranno cancellate anche tutte le entrate e le uscite relative al docente.',
            okText: 'Confermo',
            okType: 'danger',
            cancelText: 'Annulla',
            onOk() {
                /*************************/
                /* ELIMINAZIONE DOCENTE */
                /*************************/
            }
        })
    }

    render(): JSX.Element{
        const { docenti } = this.state
        
        if(!docenti){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

            return <div className="col-9 px-5 py-4 right-block" id="mainBlock">
                <Spin indicator={icon} />
            </div>
        }

        return <div className="col-9 px-5 py-4 right-block">
            <h3 className="mb-3 text-center">Docenti del corso</h3>

            <button className="btn btn-success float-right mb-3" type="button" onClick={() => routerHistory.push("/adminpanel/docenti/new")}>
                <i className="fal fa-plus"></i> Aggiungi docente
            </button>

            <table className="table table-bordered text-center">
                
                    <tbody>
                        <tr>
                            <th>Nome</th>
                            <th>Cognome</th>
                            <th>Codice Fiscale</th>
                            <th>Corso</th>
                            <th style={{width: "20%"}}>Azioni</th>
                        </tr>

                        {
                            docenti.map(d => {        
                                return <tr>
                                    <td style={{maxWidth: 0}} className="text-truncate">{d.nome}</td>
                                    <td style={{maxWidth: 0}} className="text-truncate">{d.cognome}</td>
                                    <td style={{maxWidth: 0}} className="text-truncate">{d.cf}</td>
                                    <td style={{maxWidth: 0}} className="text-truncate">{d.corso}</td>
                                    <td>
                                        <Tooltip title="Dettagli">
                                            <button type="button" className="btn btn-info circle-btn mr-2" onClick={() => routerHistory.push("/adminpanel/docenti/" + d.idDocente)}>
                                                <i className="fa fa-info"></i>
                                            </button>
                                        </Tooltip>

                                        <Tooltip title="Modifica">
                                            <button type="button" className="btn btn-warning text-white circle-btn mr-2" onClick={() => routerHistory.push("/adminpanel/docenti/edit/" + d.idDocente)}>
                                                <i className="fa fa-pen"></i>
                                            </button>
                                        </Tooltip>
                                        
                                        <Tooltip title="Elimina">
                                            <button type="button" className="btn btn-danger circle-btn" onClick={() => this.showDeleteConfirm(d)}>
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </Tooltip>
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
            </table>
        </div>
    }
}