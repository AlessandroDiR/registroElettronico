import React from "react"
import { NavLink, Route, Router, Switch } from 'react-router-dom';
import { routerHistory } from "../.."
import LoginDocenti from "./LoginDocenti";
import LezioniDocente from "./LezioniDocente";
import LezioneDetails from "./LezioneDetails";
import { IAdminDocente } from "../../models/IAdminDocente";

export default class DocentiDashboard extends React.Component{

    componentWillUnmount = () => {
        sessionStorage.removeItem("docenteSession")
    }

    render(): JSX.Element{

        let session = sessionStorage.getItem("docenteSession")
        
        if(!session)
            return <LoginDocenti />

        let admin = JSON.parse(session) as IAdminDocente

        return <div className="container-fluid">
            <Router history={routerHistory}>
                <div className="row">
                    <div className="col-12 col-lg-3 bg-blue p-0 menu">
                        <div className="logo-block px-3 py-4">
                            <img src="https://iscrizione.fitstic.it/wp-content/uploads/2015/07/Senza-titolo-1.png" height="100" className="mx-auto d-block logo" alt="logo" />
                        </div>

                        <NavLink className="router-link" activeClassName="active" onClick={() => routerHistory.push("/docentipanel/lezioni")} to="/docentipanel/lezioni">
                            <span>Lezioni tenute</span>
                        </NavLink>
                        <NavLink className="router-link" activeClassName="active" onClick={() => {
                            sessionStorage.removeItem("docenteSession")
                            routerHistory.push("/docentipanel")
                        }} exact to="/docentipanel/login">
                            <span>Esci</span>
                        </NavLink>
                    </div>

                    
                        <Switch>
                            <Route exact path="/docentipanel/" render={() => {
                                routerHistory.push("/docentipanel/lezioni")

                                return null
                            }} />

                            <Route exact path="/docentipanel/lezioni/:id" render={(routeProps) => (
                                <LezioneDetails {...routeProps} />
                            )} />

                            <Route exact path="/docentipanel/lezioni" render={() => 
                                <LezioniDocente idDocente={admin.idDocente}/>
                            } />
                        </Switch>
                        
                    </div>
            </Router>
        </div>
    }
}
