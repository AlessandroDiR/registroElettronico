import React from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import googleCalendarPlugin from "@fullcalendar/google-calendar"
import { Digits2, siteUrl } from "../utilities"
import { Modal, Icon, Spin } from "antd"
import { ICalendar } from "../models/ICalendar"
import Axios from "axios"

import "@fullcalendar/core/main.css"
import "@fullcalendar/timegrid/main.css"

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
                calendar: calendar
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
            
            <FullCalendar
                plugins={[ googleCalendarPlugin, dayGridPlugin ]}
                events={ { googleCalendarId: calendar.idGoogleCalendar} }
                googleCalendarApiKey={"AIzaSyCEEaAbHOYhofQs-iLdHd_J8-KyD_IlRbE"}
                defaultView="dayGridMonth"
                fixedWeekCount={false}
                firstDay={1}
                themeSystem={"bootstrap"}
                eventTimeFormat={{
                    hour: "2-digit",
                    minute: "2-digit",
                    meridiem: false
                }}
                buttonText={{
                    today: "Mese corrente"
                }}
                header={{
                    right: "prev, next"
                }}
                locale={"it"}
                eventClick={
                    function(info){
                        info.jsEvent.preventDefault()
                        let event = info.event
                        
                        Modal.info({
                            maskClosable: true,
                            centered: true,
                            icon: null,
                            title: event.title,
                            content: <div className="mt-3" style={{ fontSize: 20 }}>
                                <div className="row">
                                    <div className="col-3 pr-0">
                                        <span className="label">Inizio</span>
                                    </div>
                                    <div className="col">
                                        <span className="desc">
                                            { Digits2(event.start.getHours()) }:{ Digits2(event.start.getMinutes()) }
                                        </span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-3 pr-0">
                                        <span className="label">Fine</span>
                                    </div>
                                    <div className="col">
                                        <span className="desc">
                                            { Digits2(event.end.getHours()) }:{ Digits2(event.end.getMinutes()) }
                                        </span>
                                    </div>
                                </div>
                                {  
                                    event.extendedProps.location && <div className="row">
                                        <div className="col-3 pr-0">
                                            <span className="label">Luogo</span>
                                        </div>
                                        <div className="col-9" style={{ fontSize: 15 }}>
                                            {event.extendedProps.location}
                                        </div>
                                    </div>
                                }
                            </div>
                        })
                    }
                }
            />
        </div>
    }
  
  }