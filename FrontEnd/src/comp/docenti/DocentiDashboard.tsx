import React from "react"
import { NavLink, Route, Router, Switch } from 'react-router-dom';
import { routerHistory } from "../.."
import { Docente } from "../../models/DocenteModel";
import LoginDocenti from "./LoginDocenti";
import StudentsList from "./StudentsList"
import StudentDetails from "./StudentDetails";

export default class DocentiDashboard extends React.Component{

    componentWillUnmount = () => {
        localStorage.removeItem("docenteSession")
    }

    render(): JSX.Element{

        let session = localStorage.getItem("docenteSession")
        
        if(!session)
            return <LoginDocenti />

        let admin = JSON.parse(session) as Docente

        return <div className="container-fluid">
            <Router history={routerHistory}>
                <div className="row">
                    <div className="col-12 col-lg-3 bg-blue p-0 menu">
                        <div className="logo-block px-3 py-4">
                            <img src="https://iscrizione.fitstic.it/wp-content/uploads/2015/07/Senza-titolo-1.png" height="100" className="mx-auto d-block logo" alt="logo" />
                        </div>

                        <NavLink className="router-link" activeClassName="active" onClick={() => routerHistory.push("/docentipanel/studenti")} to="/docentipanel/studenti">
                            <span>Studenti</span>
                        </NavLink>
                        <NavLink className="router-link" activeClassName="active" onClick={() => {
                            localStorage.removeItem("docenteSession")
                            routerHistory.push("/docentipanel")
                        }} exact to="/docentipanel/login">
                            <span>Esci</span>
                        </NavLink>
                    </div>

                    
                        <Switch>
                            <Route exact path="/docentipanel/" render={() => {
                                routerHistory.push("/docentipanel/studenti")

                                return null
                            }} />

                            <Route exact path="/docentipanel/studenti" render={() => (
                                <StudentsList corso={admin.corso} />
                            )} />

                            <Route exact path="/docentipanel/studenti/:id" render={(routeProps) => (
                                <StudentDetails {...routeProps} corso={admin.corso} idDocente={admin.id} />
                            )} />


                        </Switch>
                        
                    </div>
            </Router>
        </div>
    }
}
