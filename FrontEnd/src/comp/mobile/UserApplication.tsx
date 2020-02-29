import React from "react"
import { NavLink, Route, Router, Switch } from "react-router-dom"
import { routerHistory } from "../.."
import { IStudent } from "../../models/IStudent"
import QRCodeScreen from "./QRCodeScreen"
import UserCalendar from "./UserCalendar"

export default class UserApplication extends React.Component{

    componentDidMount = () => {
        localStorage.setItem("student", JSON.stringify({
            idStudente: 1,
            idCorso: 1,
            nome: "Leonardo",
            cognome: "Grandolfo",
            annoFrequentazione: 1,
            cf: "GRNLRD99D17L219L",
            dataNascita: "17-04-1999",
            code: "CIAO-GGG"
        }))
    }
    
    render(): JSX.Element{
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
                                <QRCodeScreen studentId={student.idStudente} />
                            )} />

                            <Route exact path="/userprofile/calendar" render={() => (
                                <UserCalendar student={student} />
                            )} />

                        </Switch>
                    </div>

                    <div className="bottom-menu">
                        <NavLink className="router-link" activeClassName="active" onClick={() => routerHistory.push("/userprofile/presenze")} to="/userprofile/presenze">
                            <span>
                                <i className="far fa-exclamation-circle fa-fw fa-2x mb-2"></i>
                                Presenze
                            </span>
                        </NavLink>
                        <NavLink className="router-link" activeClassName="active" onClick={() => routerHistory.push("/userprofile/voti")} to="/userprofile/voti">
                            <span>
                                <i className="fa fa-stars fa-fw fa-2x mb-2"></i>
                                Voti
                            </span>
                        </NavLink>
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