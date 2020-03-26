import React from "react"
import { Modal, message, Icon, Spin } from "antd"
import Axios from "axios"
import { siteUrl } from "../../utilities"
import { ICalendar } from "../../models/ICalendar"
import Calendario from "../Calendario"
import { askPassword } from "../AskConferma"

export interface IProps{
    readonly anno: number
    readonly corso: number
}
export interface IState{
    readonly calendarId: string
    readonly calendar: ICalendar
    readonly actualId: string
}

export default class ConfigForm extends React.PureComponent<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {
            calendarId: null,
            calendar: null,
            actualId: ""
        }
    }

    componentDidMount = () => {
        const { corso, anno } = this.props

        Axios.get(siteUrl+"/api/calendari/"+corso+"/"+anno).then(response => {
            let calendar = response.data as ICalendar

            this.setState({
                calendarId: calendar.idGoogleCalendar,
                actualId: calendar.idGoogleCalendar,
                calendar: calendar
            })
        })
    }

    changeID = (e: any) => {
        let calendarId = e.target.value

        this.setState({
            calendarId: calendarId
        })
    }

    saveConfig = (e: any) => {
        e.preventDefault()

        const { corso, anno } = this.props
        const { calendarId, calendar } = this.state

        if(calendarId === ""){
            Modal.error({
                title: "Errore!",
                content: "Riempire tutti i campi."
            })

            return
        }
        
        askPassword(siteUrl+"/api/calendari", "post", {
            calendario: {
                idCalendario: calendar ? calendar.idCalendario : "0",
                idCorso: corso,
                anno: anno,
                idGoogleCalendar: calendarId
            }
        }, (_: any) => {
            this.setState({
                actualId: calendarId
            })

            message.success("Configurazione calendario salvata!")
        }, () => {
            this.setState({
                actualId: null
            })
        })
    }

    render(): JSX.Element{
        const { calendarId, actualId } = this.state

        if(calendarId === null){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />

            return <div className="text-center">
                <Spin indicator={icon} />
            </div>
        }

        return <form onSubmit={this.saveConfig}>
            <div className="form-group row mx-1">
                <div className="col px-0">
                    <label className="text-secondary">ID Calendario</label>
                    <input name="calendarID" type="text" className="form-control" value={calendarId} onChange={this.changeID} />
                </div>
            </div>

            <button type="submit" className="btn btn-success float-right mr-1 mb-3">
                {
                    actualId === null && <Icon type="loading" className="mr-2 loadable-btn" spin />
                }
                Salva configurazione
            </button>

            <div className="clearfix"></div>

            <div className="p-1">
                <h4>Anteprima visualizzazione</h4>
                <Calendario calendarId={actualId} />
            </div> 
        </form>
    }
}