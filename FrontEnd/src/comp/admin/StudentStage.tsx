import React from "react"
import Axios from "axios"
import { Modal, Spin, Icon, Tooltip, Button } from "antd"
import { IStage } from "../../models/IStage"
import { siteUrl, formatItalian, convertFromUTC } from "../../utilities"

export interface IProps{
    readonly idStudente: number
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
        Axios.get(siteUrl+"/api/studenti/getorestage/"+this.props.idStudente).then(response => {
            let oreList = response.data as IStage[]

            this.setState({
                oreList
            })
        })
    }

    render = () => {
        const { oreList } = this.state,
        { toggleModal, show } = this.props,
        icon = <Icon type="loading" style={{ fontSize: 50 }} spin />

        return <Modal visible={show} title="Ore di stage svolte" onCancel={toggleModal} width="60%" footer={[
            <Button onClick={toggleModal} type="primary">Chiudi</Button>
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
                </div>
            }
        </Modal>
    }
}