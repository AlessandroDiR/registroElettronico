import React from "react"
import { NavLink, Route, Router, Switch } from 'react-router-dom';
import { routerHistory } from "../.."
import LoginComponent from "./LoginComponent";
import { Admin } from "../../models/AdminModel";
import StudentsList from "./StudentsList";
import AddNewStudent from "./AddNewStudent";
import StudentDetails from "./StudentDetails";
import DocentiList from "./DocentiList";
import AddNewDocente from "./AddNewDocente";
import DocenteDetails from "./DocenteDetails";
import EditDocente from "./EditDocente";
import EditStudente from "./EditStudente";
import StudentsImport from "./StudentsImport";

export default class Dashboard extends React.Component{

    componentWillUnmount = () => {
        localStorage.removeItem("session")
    }

    render(): JSX.Element{

        let session = localStorage.getItem("session")
        
        if(!session)
            return <LoginComponent />

        let admin = JSON.parse(session) as Admin

        return <div className="container-fluid">
            <Router history={routerHistory}>
                <div className="row">
                    <div className="col-12 col-lg-3 bg-blue p-0 menu">
                        <div className="logo-block px-3 py-4">
                            <img src="https://iscrizione.fitstic.it/wp-content/uploads/2015/07/Senza-titolo-1.png" height="100" className="mx-auto d-block logo" alt="logo" />
                        </div>

                        <NavLink className="router-link" activeClassName="active" onClick={() => routerHistory.push("/adminpanel/studenti")} to="/adminpanel/studenti">
                            <span>Studenti</span>
                        </NavLink>
                        <NavLink className="router-link" activeClassName="active" onClick={() => routerHistory.push("/adminpanel/docenti")} to="/adminpanel/docenti">
                            <span>Docenti</span>
                        </NavLink>
                        <NavLink className="router-link" activeClassName="active" onClick={() => {
                            localStorage.removeItem("session")
                            routerHistory.push("/adminpanel")
                        }} exact to="/adminpanel/login">
                            <span>Esci</span>
                        </NavLink>
                    </div>

                    
                        <Switch>
                            <Route exact path="/adminpanel/" render={() => {
                                routerHistory.push("/adminpanel/studenti")

                                return null
                            }} />

                            <Route exact path="/adminpanel/studenti" render={() => (
                                <StudentsList corso={admin.corso} />
                            )} />

                            <Route exact path="/adminpanel/studenti/new" render={() => (
                                <AddNewStudent corso={admin.corso} />
                            )} />

                            <Route exact path="/adminpanel/studenti/import" render={() => (
                                <StudentsImport corso={admin.corso} />
                            )} />

                            <Route exact path="/adminpanel/studenti/:id" render={(routeProps) => (
                                <StudentDetails {...routeProps} corso={admin.corso} />
                            )} />

                            <Route exact path="/adminpanel/studenti/edit/:id" render={(routeProps) => (
                                <EditStudente {...routeProps} corso={admin.corso} />
                            )} />

                            <Route exact path="/adminpanel/docenti" render={() => (
                                <DocentiList corso={admin.corso} />
                            )} />

                            <Route exact path="/adminpanel/docenti/new" render={() => (
                                <AddNewDocente corso={admin.corso} />
                            )} />

                            <Route exact path="/adminpanel/docenti/:id" render={(routeProps) => (
                                <DocenteDetails {...routeProps} corso={admin.corso} />
                            )} />

                            <Route exact path="/adminpanel/docenti/edit/:id" render={(routeProps) => (
                                <EditDocente {...routeProps} corso={admin.corso} />
                            )} />

                        </Switch>
                        
                    </div>
            </Router>
        </div>
    }
}
