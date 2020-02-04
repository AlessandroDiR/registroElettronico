import React from "react"
import { NavLink, Route, Router, Switch } from 'react-router-dom';
import { routerHistory } from "../.."
import { IStudent } from "../../models/IStudent";
import QRCodeScreen from "./QRCodeScreen";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import googleCalendarPlugin from '@fullcalendar/google-calendar';

import '@fullcalendar/core/main.css'
import '@fullcalendar/timegrid/main.css';
import { Digits2 } from "../../utilities";

export default class UserApplication extends React.Component{

    closeBubble = () => {
        let current = document.getElementById("bubble"),
        body = document.getElementsByTagName("body")[0]
        
        if(current)
            body.removeChild(current)
    }

    componentDidMount = () => {
        localStorage.setItem("student", JSON.stringify({
            id: 1,
            corso: 1,
            nome: "Leonardo",
            cognome: "Grandolfo",
            anno: 1,
            cf: "GRNLRD99D17L219L",
            dataNascita: "17-04-1999",
            luogoNascita: "Torino",
            code: "CIAO-GGG"
        }))
    }

    componentWillUnmount = () => {
        // localStorage.removeItem("student")
    }

    render(): JSX.Element{
        let self = this
        
        let session = localStorage.getItem("student")
        // if(!session)
        //     return <AppLogin />

        let student = JSON.parse(session) as IStudent

        return <div className="container-fluid px-0">
            <Router history={routerHistory}>
                    <div className="main-screen overflow-auto" id="mainBlock">
                        <Switch>
                            <Route exact path="/userprofile" render={() => {
                                routerHistory.push("/userprofile/qrcode")

                                return null
                            }} />

                            <Route exact path="/userprofile/qrcode" render={() => (
                                <QRCodeScreen studentId={student.id} />
                            )} />

                            <Route exact path="/userprofile/calendar" render={() => (
                                <div>
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
                                            body = document.getElementsByTagName("body")[0],
                                            children = bubble.childNodes[0]
                                            
                                            if(current)
                                                body.removeChild(current)
                    
                                            body.appendChild(bubble)
                    
                                            children.removeEventListener("click", self.closeBubble)
                                            children.addEventListener("click", self.closeBubble)
                                        }
                                    } />
                                </div>
                            )} />

                        </Switch>
                    </div>

                    <div className="bottom-menu">
                        <NavLink className="router-link" activeClassName="active" onClick={() => routerHistory.push("/userprofile/qrcode")} to="/userprofile/qrcode">
                            <span>
                                <i className="fal fa-qrcode fa-fw fa-2x mb-2"></i>
                                Codice QR
                            </span>
                        </NavLink>
                        <NavLink className="router-link" activeClassName="active" onClick={() => routerHistory.push("/userprofile/calendar")} to="/userprofile/calendar">
                            <span>
                                <i className="fal fa-calendar fa-fw fa-2x mb-2"></i>
                                Lezioni
                            </span>
                        </NavLink>
                        <NavLink className="router-link" activeClassName="active" onClick={() => routerHistory.push("/userprofile/account")} to="/userprofile/account">
                            <span>
                                <i className="far fa-user fa-fw fa-2x mb-2"></i>
                                Profilo
                            </span>
                        </NavLink>
                    </div>
            </Router>
        </div>
    }
}