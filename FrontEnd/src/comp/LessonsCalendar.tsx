import React from "react"
import { siteUrl } from "../utilities"
import { Icon, Spin } from "antd"
import { ICalendar } from "../models/ICalendar"
import Axios from "axios"
import Calendario from "./Calendario"

export interface IProps{}
export interface IState{
    readonly calendar: ICalendar
}

export default class LessonsCalendar extends React.PureComponent<IProps, IState> {
    constructor(props: IProps){
        super(props)
        
        this.state = {
            calendar: null
        }
    }

    componentDidMount = () => {
        let idCorso = parseInt(sessionStorage.getItem("corso")),
        classe = parseInt(sessionStorage.getItem("classe"))
        
        Axios.get(siteUrl+"/api/calendari/"+idCorso+"/"+classe).then(response => {
            let calendar = response.data as ICalendar

            this.setState({
                calendar
            })
        })
    }

    render() {
        const { calendar } = this.state
    
        if(!calendar){
            const icon = <Icon type="loading" style={{ fontSize: 50 }} spin />

            return <div className="col px-5 py-4 right-block" id="mainBlock">
                <Spin indicator={icon} />
            </div>
        }

        return <div className="col px-5 py-3" id="mainBlock">
            <Calendario calendarId={calendar.idGoogleCalendar} />
        </div>
    }
  
  }