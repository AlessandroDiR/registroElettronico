import React from "react"
import Axios from "axios"
import { Modal, Spin, Icon, Tooltip, Button } from "antd"
import { IStage } from "../../models/IStage"
import { siteUrl, formatItalian, convertFromUTC } from "../../utilities"
import { CSVLink } from "react-csv"
import { IStudent } from "../../models/IStudent"

export interface IProps{
    readonly studente: IStudent
    readonly toggleModal: () => void
    readonly show: boolean
}
export interface IState{
    readonly oreList: IStage[]
}

export default class StudentStage extends React.PureComponent<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {
            oreList: null
        }
    }

    componentDidMount = () => {
        Axios.get(siteUrl+"/api/studenti/getorestage/"+this.props.studente.idStudente).then(response => {
            let data = response.data,
            oreList = data.map((o: any) => {
                o.data = formatItalian(o.data)
                o.oraInizio = convertFromUTC(o.oraInizio + "Z")
                o.oraFine = convertFromUTC(o.oraFine + "Z")

                return o as IStage
            })

            this.setState({
                oreList
            })
        })
    }

    render = () => {
        const { oreList } = this.state,
        { toggleModal, show, studente } = this.props,
        icon = <Icon type="loading" style={{ fontSize: 50 }} spin />

        return <Modal visible={show} title="Ore di stage svolte" onCancel={toggleModal} width="60%" footer={[
            <Button type="primary" disabled={!oreList || oreList.length === 0}>
                <CSVLink data={oreList ? oreList.map(o => Object.values(o)) : null} filename={"oreStage"+studente.nome+studente.cognome+".csv"}>
                    <i className="far fa-arrow-to-bottom mr-2"></i> Scarica CSV
                </CSVLink>
            </Button>,
            <Button onClick={toggleModal}>Chiudi</Button>
        ]}>
            {
                !oreList ? <div className="text-center">
                    <Spin indicator={icon} />
                </div> : <div>
                    {
                        !oreList.length ? <div className="text-center">Ore stage non segnate.</div> : <table className="table table-bordered text-center">
                            <tbody>
                                <tr>
                                    <th style={{width: "15%"}}>Data</th>
                                    <th style={{width: "25%"}}>Descrizione</th>
                                    <th>Inizio</th>
                                    <th>Fine</th>
                                    <th>Ore svolte</th>
                                </tr>

                                {
                                    oreList.map(s => {        
                                        return <tr>
                                            <td>{s.data}</td>
                                            <Tooltip title={s.argomento}>
                                                <td style={{maxWidth: 0}} className="text-truncate">{s.argomento}</td>
                                            </Tooltip>
                                            <td style={{maxWidth: 0}} className="text-truncate">{s.oraInizio}</td>
                                            <td style={{maxWidth: 0}} className="text-truncate">{s.oraFine}</td>
                                            <td style={{maxWidth: 0}} className="text-truncate">{s.totaleRelativo}</td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    }
                </div>
            }
        </Modal>
    }
}