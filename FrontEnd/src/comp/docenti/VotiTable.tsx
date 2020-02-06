import React from "react"
import { Tooltip, Icon, Spin, Modal } from "antd"
import { IVoti } from "../../models/IVoti"
import { routerHistory } from "../.."

export interface IProps{
    readonly docente: number
}
export interface IState{
    readonly voti: IVoti[]
}

export default class VotiTable extends React.PureComponent<IProps, IState>{

    constructor(props: IProps){
        super(props)

        this.state = {
            voti: [{
                docente: "Brizio",
                materia: "Databees",
                voto: 0,
                data: "03/02/2020",
            },{
                docente: "Fabrizio",
            materia: "Matematica",
            voto: 2,
            data: "04/02/2020",
            }]
        }
    }

    componentDidMount = () => {
        /*******************************/
        /* CARICAMENTO VOTI DOCENTE */
        /*******************************/
    }

    confirmDeleteMark = (mark: number) => {
        Modal.confirm({
            title: "Attenzione!",
            content: "Confermi di voler eliminare questo voto per lo studente?",
            okText: 'Confermo',
            okType: 'danger',
            cancelText: 'Annulla',
            onOk() {
                /************************************/
                /* ELIMINAZIONE VOTO            */
                /* this.state.voti = null       */
                /* RICHIESTA AXIOS LISTA AGGIORNATA */
                /************************************/
            }
        })
    }

    render(): JSX.Element{
        const { voti } = this.state

        if(!voti){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

            return <div>
                <Spin indicator={icon} />
            </div>
        }

        return <table className="table table-bordered text-center mt-3">
            <tbody>
                <tr className="thead-light">
                    <th>Data</th>
                    <th>Materia</th>
                    <th>Voto</th>
                    <th style={{width: "15%"}}>Azioni</th>
                </tr>

                {
                    voti.map(p => {
                        return <tr>
                            <td style={{maxWidth: 0}} className="text-truncate">{p.data}</td>
                            <td style={{maxWidth: 0}} className="text-truncate">{p.materia}</td>
                            <td style={{maxWidth: 0}} className="text-truncate">{p.voto}</td>
                            <td>
                                <Tooltip title="Modifica voto">
                                    <button type="button" className="fa fa-pen btn btn-orange circle-btn mr-2" onClick={() => routerHistory.push("/docentipanel/voti/edit/" + p.id)}></button>
                                </Tooltip>
                                <Tooltip title="Cancella voto">
                                    <button type="button" className="fa fa-trash btn btn-danger circle-btn" onClick={() => this.confirmDeleteMark(p.id)}></button>
                                </Tooltip>
                            </td>
                        </tr>
                    })
                }
            </tbody>
        </table>
    }
}