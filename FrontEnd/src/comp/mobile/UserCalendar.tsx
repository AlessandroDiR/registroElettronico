import React from "react"
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import { Digits2 } from "../../utilities";
import googleCalendarPlugin from '@fullcalendar/google-calendar';

import '@fullcalendar/core/main.css'
import '@fullcalendar/timegrid/main.css';

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
                    
                    let event = info.event,
                    bubble = document.createElement("div")

                    bubble.setAttribute('id', "bubble");
                    bubble.setAttribute('class', "event-bubble mobile-bubble")

                    bubble.innerHTML = `<div class="bubble-close" id="close-b"><i class="fal fa-times fa-fw"></i></div>
                        <h6 class="event-title"><i class="fad fa-calendar-check fa-fw icon fa-lg"></i> ` + event.title + `</h6>
                        <div class="row px-2 py-1">
                            <div class="col-4 pl-0"><span class="label">Inizio</span></div>
                            <div class="col-8 pl-0"><span class="desc">` + Digits2(event.start.getHours()) + `:` + Digits2(event.start.getMinutes()) + `</span></div>
                        </div>
                        <div class="row px-2 py-1">
                            <div class="col-4 pl-0"><span class="label">Fine</span></div>
                            <div class="col-8 pl-0"><span class="desc">` + Digits2(event.end.getHours()) + `:` + Digits2(event.end.getMinutes()) + `</span></div>
                        </div>`

                    if(event.extendedProps.location){
                        bubble.innerHTML = bubble.innerHTML + `<div class="row px-2 py-1">
                            <div class="col-4 pl-0"><span class="label where">Luogo</span></div>
                            <div class="col-8 px-0 where">` + event.extendedProps.location + `</div>
                        </div>`
                    }
                
                    let current = document.getElementById("bubble"),
                    body = document.getElementsByTagName("body")[0]
                    
                    if(current)
                        body.removeChild(current)

                    body.appendChild(bubble)
                }
            } />
        </div>
    }
}