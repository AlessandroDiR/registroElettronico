import React from "react"
import { IAdmin } from "../../models/IAdmin"
import { ILezioneCorrente } from "../../models/ILezioneCorrente"
import Axios from "axios"
import { siteUrl, convertFromUTC } from "../../utilities"
import { Tabs, Icon, Spin } from "antd"

export interface IProps{
    readonly coordinatore: IAdmin
}
export interface IState{
    readonly lezioneCorrente1: ILezioneCorrente
    readonly noLezione1: boolean
    readonly lezioneCorrente2: ILezioneCorrente
    readonly noLezione2: boolean
}

export default class Home extends React.PureComponent<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {
            lezioneCorrente1: null,
            noLezione1: false,
            lezioneCorrente2: null,
            noLezione2: false
        }
    }

    componentDidMount = () => {
        const { coordinatore } = this.props

        Axios.get(siteUrl+"/api/lezioni/getlezionecorrente/"+coordinatore.idCorso+"/1").then(response => {
            if(typeof(response.data) === "string"){
                this.setState({
                    noLezione1: true
                })
            }else{
                let data = response.data as ILezioneCorrente

                this.setState({
                    lezioneCorrente1: data
                })
            }
        })

        Axios.get(siteUrl+"/api/lezioni/getlezionecorrente/"+coordinatore.idCorso+"/2").then(response => {
            if(typeof(response.data) === "string"){
                this.setState({
                    noLezione2: true
                })
            }else{
                let data = response.data as ILezioneCorrente

                this.setState({
                    lezioneCorrente2: data
                })
            }
        })
    }

    getContenuto = (lezione: ILezioneCorrente) => {
        return <div>
            <div className="col-12 col-md-6 mb-2 px-2">
                <div className="p-3 bg-white border rounded">
                    <h4 className="text-uppercase mb-2 text-truncate">{lezione.lezione.titolo}</h4>
                    <span className="text-muted">{convertFromUTC(lezione.lezione.oraInizio)} - {convertFromUTC(lezione.lezione.oraFine)}</span>
                </div>
            </div>

            <h6 className="mt-3 mb-2 ml-2">Studenti presenti</h6>
            <div className="row mx-0">
                {
                    lezione.studenti.map(s => {
                        return <div className="col-12 col-md-4 mb-md-0 p-1 p-md-2">
                            <div className="border rounded p-2 text-truncate">{s.nome} {s.cognome}</div>
                        </div>
                    })
                }
            </div>
        </div>
    }

    render(): JSX.Element{
        const { coordinatore } = this.props,
        { lezioneCorrente1, lezioneCorrente2, noLezione1, noLezione2 } = this.state,
        { TabPane } = Tabs,
        icon = <Icon type="loading" style={{ fontSize: 50 }} spin />

        return <div className="col px-5 py-4 right-block">
            <h3 className="mb-3 text-center">Home coordinatore</h3>

            <div className="col-12 col-md-6 mb-2 mb-md-0 p-3 bg-white border rounded">
                <span className="border-text">Dati personali</span>
                <h4 className="text-uppercase mb-2 text-truncate">{coordinatore.nome} {coordinatore.cognome}</h4>

                Codice di accesso alla firma: <strong>{coordinatore.codiceCorso}</strong>
            </div>

            <h4 className="mt-3 mb-2">Lezioni in corso</h4>

            <Tabs>
                <TabPane tab="Primo anno" key="1">
                    {
                        !lezioneCorrente1 && !noLezione1 && <div className="text-center">
                            <Spin indicator={icon} />
                        </div>
                    }
                    {
                        !lezioneCorrente1 && noLezione1 && <div className="text-center">
                            Non ci sono lezioni in corso.
                        </div>
                    }
                    {
                        lezioneCorrente1 && !noLezione1 && this.getContenuto(lezioneCorrente1)
                    }
                </TabPane>
                <TabPane tab="Secondo anno" key="2">
                {
                        !lezioneCorrente2 && !noLezione2 && <div className="text-center">
                            <Spin indicator={icon} />
                        </div>
                    }
                    {
                        !lezioneCorrente2 && noLezione2 && <div className="text-center">
                            Non ci sono lezioni in corso.
                        </div>
                    }
                    {
                        lezioneCorrente2 && !noLezione2 && this.getContenuto(lezioneCorrente2)
                    }
                </TabPane>
            </Tabs>
        </div>
    }
}