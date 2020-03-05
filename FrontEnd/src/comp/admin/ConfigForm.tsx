import React from "react"
import { Modal, message, Icon, Spin } from "antd"
import Axios from "axios"
import { siteUrl } from "../../utilities"
import { ICalendar } from "../../models/ICalendar"

export interface IProps{
    readonly anno: number
    readonly corso: number
}
export interface IState{
    readonly calendarId: string
    readonly calendar: ICalendar
}

export default class ConfigForm extends React.PureComponent<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {
            calendarId: null,
            calendar: null
        }
    }

    componentDidMount = () => {
        const { corso, anno } = this.props

        Axios.get(siteUrl+"/api/calendari/"+corso+"/"+anno).then(response => {
            let calendar = response.data as ICalendar

            this.setState({
                calendarId: calendar.idGoogleCalendar,
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

    saveConfig = () => {
        const { corso, anno } = this.props
        const { calendarId, calendar } = this.state

        if(calendarId === ""){
            Modal.error({
                title: "Errore!",
                content: "Riempire tutti i campi."
            })

            return
        }

        Axios.post(siteUrl+"/api/calendari", {
            IdCalendario: calendar ? calendar.idCalendar : "0",
            IdCorso: corso,
            Anno: anno,
            IdGoogleCalendar: calendarId
        }).then(_ => {
            message.success("Configurazione calendario salvata!")
        })
    }

    render(): JSX.Element{
        const { calendarId } = this.state

        if(calendarId === null){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />

            return <div className="text-center">
                <Spin indicator={icon} />
            </div>
        }

        return <form>
            <div className="form-group row">
                <div className="col">
                    <label className="text-secondary">ID Calendario</label>
                    <input name="calendarID" type="text" className="form-control" value={calendarId} onChange={this.changeID} />
                </div>
            </div>

            <button type="button" className="btn btn-success float-right mr-1 mb-1" onClick={this.saveConfig}>Salva configurazione</button>
        </form>
    }
}