import React from "react"
import { ICorso } from "../../models/ICorso";
import Axios from "axios";
import { siteUrl } from "../../utilities";
import { Icon, Spin, Tooltip } from "antd";
import { routerHistory } from "../..";

export interface IProps{}
export interface IState{
    readonly corsi: ICorso[]
}

export default class CorsiList extends React.PureComponent<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {
            corsi: null
        }
    }

    componentDidMount = () => {
        Axios.get(siteUrl+"/api/corsi").then(response => {
            let corsi = response.data as ICorso[]

            this.setState({
                corsi: corsi
            })
        })
    }

    render(): JSX.Element{
        const { corsi } = this.state
        
        if(!corsi){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

            return <div className="col-9 px-5 py-4 right-block" id="mainBlock">
                <Spin indicator={icon} />
            </div>
        }

        return <div className="col-9 px-5 py-4 right-block">
            <h3 className="mb-3 text-center">Lista dei corsi</h3>

            <button className="btn btn-success float-right mb-3" type="button" onClick={() => routerHistory.push("/adminpanel/corsi/new")}>
                <i className="fal fa-plus"></i> Aggiungi corso
            </button>

            <table className="table table-bordered text-center">
                
                    <tbody>
                        <tr>
                            <th>Nome</th>
                            <th>Descrizione</th>
                            <th>Luogo</th>
                            <th style={{width: "10%"}}>Azioni</th>
                        </tr>

                        {
                            corsi.map(c => {        
                                return <tr>
                                    <td style={{maxWidth: 0}} className="text-truncate">{c.nome}</td>
                                    <td style={{maxWidth: 0}} className="text-truncate">{c.desc}</td>
                                    <td style={{maxWidth: 0}} className="text-truncate">{c.luogo}</td>
                                    <td>
                                        <Tooltip title="Modifica">
                                            <button type="button" className="btn btn-warning text-white circle-btn" onClick={() => routerHistory.push("/adminpanel/corsi/edit/" + c.idCorso)}>
                                                <i className="fa fa-pen"></i>
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