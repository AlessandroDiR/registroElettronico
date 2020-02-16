import React from "react"
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import { Digits2 } from "../../utilities";
import googleCalendarPlugin from '@fullcalendar/google-calendar';

import '@fullcalendar/core/main.css'
import '@fullcalendar/timegrid/main.css';
import { Modal } from "antd";

export interface IProps{
    readonly corso?: number
}
export interface IState{
    // variabile che prende il calendario, da caricare in base al corso
}

export default class UserCalendar extends React.PureComponent<IProps, IState> {    
    render(): JSX.Element{
        return <div>
            <h5 className="text-center text-black w-100">Calendario del mese</h5>
            <FullCalendar
            plugins={[ googleCalendarPlugin, dayGridPlugin ]}
            events={ { googleCalendarId: 'ckhj7iqj3msae4i4ietm5ip1cg@group.calendar.google.com'} }
            googleCalendarApiKey={'AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs'}
            defaultView="dayGridMonth"
            fixedWeekCount={false}
            header={false}
            firstDay={1}
            themeSystem={'bootstrap'}
            eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                meridiem: false
            }}
            locale={'it'}
            eventClick={
                function(info){
                    info.jsEvent.preventDefault();
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
                                    <div className="col" style={{ fontSize: 15 }}>
                                        {event.extendedProps.location}
                                    </div>
                                </div>
                            }
                        </div>
                    })
                }
            } />
        </div>
    }
}