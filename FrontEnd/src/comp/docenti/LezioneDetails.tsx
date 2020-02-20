import React from "react"
import { RouteComponentProps } from "react-router-dom";
import { ILezione } from "../../models/ILezione";
import Axios from "axios";
import { siteUrl } from "../../utilities";
import { Icon, Spin } from "antd";
import { IStudent } from "../../models/IStudent";

export interface IRouteParams{
    readonly id: string
}
export interface IProps extends RouteComponentProps<IRouteParams>{
    readonly corso: number
}
export interface IState{
    readonly lezione: ILezione
    readonly studenti: IStudent[]
}

export default class LezioneDetails extends React.PureComponent<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {
            lezione: null,
            studenti: null
        }
    }

    componentDidMount = () => {
        Axios.get(siteUrl+"/api/lezioni/"+this.props.match.params.id).then(response => {
            let lezione = response.data as ILezione

            this.setState({
                lezione: lezione
            })

            Axios.get(siteUrl+"/api/studenti/"+lezione.idCorso).then(response => {
                let studenti = response.data as IStudent[]
    
                this.setState({
                    studenti: studenti
                })
            })
        })
    }

    render(): JSX.Element{
        const { lezione, studenti } = this.state

        if(!lezione || !studenti){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

            return <div className="col-9 px-5 py-4 right-block" id="mainBlock">
                <Spin indicator={icon} />
            </div>
        }

        return <div className="col-9 px-5 py-4 right-block">
            <h3 className="mb-3 text-center">Lezione del {lezione.data}</h3>

            <table className="table table-bordered text-center">
                
                    <tbody>
                        <tr>
                            <th>Nome</th>
                            <th>Cognome</th>
                            <th>Presenza</th>
                        </tr>

                        {
                            studenti.map(s => {      
                                let find = lezione.frequentata.find(stu => stu.idStudente === s.idStudente),
                                presente = find ? "Presente" : "Assente",
                                color = find ? "success" : "danger"
                                  
                                return <tr>
                                    <td style={{maxWidth: 0}} className="text-truncate">{s.nome}</td>
                                    <td style={{maxWidth: 0}} className="text-truncate">{s.cognome}</td>
                                    <td style={{maxWidth: 0}} className={"text-truncate text-white bg-"+color}>{presente}</td>
                                </tr>
                            })
                        }
                    </tbody>
            </table>
        </div>
    }
}