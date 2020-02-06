import React from "react"
import { IStudent } from "../../models/IStudent";
import { routerHistory } from "../..";
import { Tooltip, Spin, Icon } from "antd"
import Axios from "axios";
import { siteUrl } from "../../utilities";

export interface IProps{
    readonly corso: number
}
export interface IState{
    readonly students: IStudent[]
}

export default class StudentsList extends React.PureComponent<IProps, IState>{

    constructor(props: IProps){
        super(props)

        this.state = {
            students: null
        }
    }

    componentDidMount = () => {
        Axios.get(siteUrl+"/reg/api?studenti&corso=" + this.props.corso).then((response) => {
            this.setState({
                students: response.data as IStudent[]
            })
        })
    }

    render(): JSX.Element{
        const { students } = this.state
        
        if(!students){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

            return <div className="col-9 px-5 py-4 right-block" id="mainBlock">
                <Spin indicator={icon} />
            </div>
        }
        
        let firstYear = students.filter(s => s.anno === 1),
        secondYear = students.filter(s => s.anno === 2),
        groups = [firstYear, secondYear]

        return <div className="col-9 px-5 py-4 right-block">
            <h3 className="mb-3 text-center">Studenti del corso</h3>

            <table className="table table-bordered text-center">
                
                {
                    groups.map(g => {
                        return <tbody className="border-top-0">
                            
                            <tr className="thead-light">
                                <th colSpan={7}>
                                    { g[0].anno === 1 ? "Primo" : "Secondo" } anno
                                </th>
                            </tr>

                            <tr>
                                <th>Nome</th>
                                <th>Cognome</th>
                                <th>Codice Fiscale</th>
                                <th>Corso</th>
                                <th style={{width: "18%"}}>Anno scolastico</th>
                                <th style={{width: "10%"}}>Azioni</th>
                            </tr>
                
                            {
                                g.map(s => {            
                                    return <tr>
                                        <td style={{maxWidth: 0}} className="text-truncate">{s.nome}</td>
                                        <td style={{maxWidth: 0}} className="text-truncate">{s.cognome}</td>
                                        <td style={{maxWidth: 0}} className="text-truncate">{s.cf}</td>
                                        <td style={{maxWidth: 0}} className="text-truncate">{s.corso}</td>
                                        <td style={{maxWidth: 0}} className="text-truncate">{s.anno}-{s.anno + 1}</td>
                                        <td>
                                            <Tooltip title="Voti">
                                                <button type="button" className="btn btn-info text-white circle-btn" onClick={() => routerHistory.push("/docentipanel/studenti/" + s.id)}>
                                                    <i className="fa fa-stars"></i>
                                                </button>
                                            </Tooltip>
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    })
                }
            </table>
        </div>
    }
}