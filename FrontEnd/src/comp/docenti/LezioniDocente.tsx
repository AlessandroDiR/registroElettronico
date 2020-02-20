import React from "react"
import { ILezione } from "../../models/ILezione";
import { Icon, Spin, Tooltip } from "antd";
import { routerHistory } from "../..";
import Axios from "axios";
import { siteUrl, formatItalian } from "../../utilities";

export interface IProps{
    readonly idDocente: number
}
export interface IState{
    readonly lezioni: ILezione[]
}

export default class LezioniDocente extends React.PureComponent<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {
            lezioni: null
        }
    }

    componentDidMount = () => {
        const { idDocente } = this.props

        //LEZIONI VANNO PRESE TUTTE QUELLE TENUTE E DIVISE IN BASE AI CORSI

        Axios.get(siteUrl+"/api/lezioni/"+idDocente).then(response => {
            let lezioni = response.data as ILezione[]

            this.setState({
                lezioni: lezioni
            })
        })
    }

    render(): JSX.Element{
        const { lezioni } = this.state
        
        if(!lezioni){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

            return <div className="col-9 px-5 py-4 right-block" id="mainBlock">
                <Spin indicator={icon} />
            </div>
        }

        return <div className="col-9 px-5 py-4 right-block">
            <h3 className="mb-3 text-center">Lezioni tenute</h3>

            <table className="table table-bordered text-center">
                
                    <tbody>
                        <tr>
                            <th>Data</th>
                            <th>Orario inizio</th>
                            <th>Orario fine</th>
                            <th style={{width: "20%"}}>Azioni</th>
                        </tr>

                        {
                            lezioni.map(l => {        
                                return <tr>
                                    <td style={{maxWidth: 0}} className="text-truncate">{formatItalian(l.data)}</td>
                                    <td style={{maxWidth: 0}} className="text-truncate">{l.inizio}</td>
                                    <td style={{maxWidth: 0}} className="text-truncate">{l.fine}</td>
                                    <td>
                                        <Tooltip title="Dettagli">
                                            <button type="button" className="btn btn-info circle-btn" onClick={() => routerHistory.push("/docentipanel/lezioni/" + l.idLezione)}>
                                                <i className="fa fa-info"></i>
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