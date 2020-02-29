import React from "react"
import Axios from "axios";
import { siteUrl, superAdminRoute } from "../../utilities";
import { Icon, Spin, Tooltip } from "antd";
import { routerHistory } from "../..";
import { ITutor } from "../../models/ITutor";

export interface IProps{}
export interface IState{
    readonly tutor: ITutor[]
}

export default class TutorList extends React.PureComponent<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {
            tutor: null
        }
    }

    componentDidMount = () => {
        Axios.get(siteUrl+"/api/tutor").then(response => {
            let tutor = response.data as ITutor[]

            this.setState({
                tutor: tutor
            })
        })
    }

    render(): JSX.Element{
        const { tutor } = this.state
        
        if(!tutor){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

            return <div className="col px-5 py-4 right-block" id="mainBlock">
                <Spin indicator={icon} />
            </div>
        }

        return <div className="col px-5 py-4 right-block">
            <h3 className="mb-3 text-center">Lista dei coordinatori</h3>

            <button className="btn btn-success float-right mb-3" type="button" onClick={() => routerHistory.push(superAdminRoute+"/tutor/new")}>
                <i className="fal fa-plus"></i> Aggiungi coordinatore
            </button>

            <table className="table table-bordered text-center">
                
                    <tbody>
                        <tr>
                            <th>Nome</th>
                            <th>Cognome</th>
                            <th style={{width: "30%"}}>Corso</th>
                            <th style={{width: "10%"}}>Azioni</th>
                        </tr>

                        {
                            tutor.map(t => {        
                                return <tr>
                                    <td style={{maxWidth: 0}} className="text-truncate">{t.nome}</td>
                                    <td style={{maxWidth: 0}} className="text-truncate">{t.cognome}</td>
                                    <td style={{maxWidth: 0}} className="text-truncate">{t.corso}</td>
                                    <td>
                                        <Tooltip title="Modifica">
                                            <button type="button" className="btn btn-warning text-white circle-btn" onClick={() => routerHistory.push(superAdminRoute+"/tutor/edit/" + t.idTutor)}>
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