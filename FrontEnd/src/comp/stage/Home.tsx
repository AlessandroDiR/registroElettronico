import React from "react"
import Axios from "axios"
import { Spin, Icon, Progress, Tooltip } from "antd"
import { IStage } from "../../models/IStage"
import { siteUrl, formatItalian, convertFromUTC } from "../../utilities"
import AddForm from "./AddForm"
import { IStudent } from "../../models/IStudent"

export interface IProps{
    readonly studente: IStudent
}
export interface IState{
    readonly oreList: IStage[]
    readonly addNew: boolean
    readonly totaleOre: number
}

export default class Home extends React.PureComponent<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {
            oreList: null,
            addNew: false,
            totaleOre: 0
        }
    }

    componentDidMount = () => {
        this.loadOre()
    }

    loadOre = () => {
        this.setState({
            oreList: null,
            addNew: false
        })

        Axios.get(siteUrl+"/api/studenti/getorestage/"+this.props.studente.idStudente).then(response => {
            let ore = response.data as IStage[],
            totale = 0

            ore.forEach(o => totale += o.totaleRelativo)

            this.setState({
                oreList: ore,
                totaleOre: totale
            })
        })
    }

    toggleAdd = () => {
        this.setState({
            addNew: !this.state.addNew
        })
    }

    render(): JSX.Element{
        const { oreList, addNew, totaleOre } = this.state,
        { studente } = this.props

        if(!oreList){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />

            return <div className="col px-5 py-4 right-block" id="mainBlock">
                <Spin indicator={icon} />
            </div>
        }

        return <div className="col px-5 py-4 right-block">
            
            <div className="p-3 bg-white border rounded col-4 mb-3">
                <h4 className="text-uppercase mb-2 text-truncate">{studente.nome} {studente.cognome}</h4>
                <strong>Ore svolte</strong>: {totaleOre} su 800 totali
                <Progress percent={Math.floor(((100 * totaleOre / 800) + Number.EPSILON) * 100) / 100} />
            </div>

            <h3 className="d-inline-block">Ore di stage segnate</h3>

            <button className="btn btn-success float-right mb-3" type="button" onClick={this.toggleAdd}>
                <i className="fal fa-plus fa-fw"></i> Aggiungi ore di stage
            </button>

            <div className="clearfix"></div>

            {
                !oreList.length ? <div className="text-center">Non hai ancora segnato ore di stage.</div> : <table className="table table-bordered text-center">
                    <tbody>
                        <tr>
                            <th style={{width: "15%"}}>Data</th>
                            <th style={{width: "25%"}}>Descrizione</th>
                            <th>Inizio</th>
                            <th>Fine</th>
                            <th>Totale</th>
                        </tr>

                        {
                            oreList.map(s => {        
                                return <tr>
                                    <td>{formatItalian(s.data)}</td>
                                    <Tooltip title={s.argomento}>
                                        <td style={{maxWidth: 0}} className="text-truncate">{s.argomento}</td>
                                    </Tooltip>
                                    <td style={{maxWidth: 0}} className="text-truncate">{convertFromUTC(s.oraInizio + "Z")}</td>
                                    <td style={{maxWidth: 0}} className="text-truncate">{convertFromUTC(s.oraFine + "Z")}</td>
                                    <td style={{maxWidth: 0}} className="text-truncate">{s.totaleRelativo}</td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            }

            <AddForm studente={studente} annullaAggiunta={this.toggleAdd} visible={addNew} reloadStage={this.loadOre} />
        </div>
    }
}