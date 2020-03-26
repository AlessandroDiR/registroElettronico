import React from "react"
import { NavLink, Route, Router, Switch } from "react-router-dom"
import { routerHistory } from "../.."
import LogoCorso from "../LogoCorso"
import Page404 from "../Page404"
import { superAdminRoute } from "../../utilities"
import CorsiList from "./CorsiList"
import AddNewCorso from "./AddNewCorso"
import LoginAdmin from "./LoginAdmin"
import EditCorso from "./EditCorso"
import TutorList from "./TutorList"
import AddNewTutor from "./AddNewTutor"
import EditTutor from "./EditTutor"

export default class SuperDashboard extends React.Component{

    componentWillUnmount = () => {
        sessionStorage.removeItem("superSession")
    }

    render(): JSX.Element{

        let session = sessionStorage.getItem("superSession")
        
        if(!session)
            return <LoginAdmin />

        return <div className="container-fluid">
            <Router history={routerHistory}>
                <div className="row">
                    <div className="col-3 bg-blue p-0 menu">
                        
                        <LogoCorso idCorso={0} />

                        <NavLink className="router-link" activeClassName="active" onClick={() => routerHistory.push(superAdminRoute+"/studenti")} to={superAdminRoute+"/tutor"}>
                            <span><i className="fal fa-users-crown fa-fw mr-1"></i> Coordinatori</span>
                        </NavLink>
                        <NavLink className="router-link" activeClassName="active" onClick={() => routerHistory.push(superAdminRoute+"/corsi")} to={superAdminRoute+"/corsi"}>
                            <span><i className="fal fa-list-alt fa-fw mr-1"></i> Corsi</span>
                        </NavLink>
                        <NavLink className="router-link" activeClassName="active" onClick={() => {
                            sessionStorage.removeItem("superSession")
                            routerHistory.push(superAdminRoute)
                        }} exact to={superAdminRoute+"/login"}>
                            <span><i className="fal fa-power-off fa-fw mr-1"></i> Esci</span>
                        </NavLink>

                        <div className="copyright">
                            {(new Date()).getFullYear()} Copyright FITSTIC
                        </div>
                    </div>
  
                    <Switch>
                        <Route exact path={superAdminRoute} render={() => {
                            routerHistory.push(superAdminRoute+"/tutor")

                            return null
                        }} />

                        <Route exact path={superAdminRoute+"/tutor"} render={() => (
                            <TutorList />
                        )} />

                        <Route exact path={superAdminRoute+"/tutor/new"} render={() => (
                            <AddNewTutor />
                        )} />

                        <Route exact path={superAdminRoute+"/tutor/edit/:id"} render={(routeProps) => (
                            <EditTutor {...routeProps} />
                        )} />

                        <Route exact path={superAdminRoute+"/corsi"} render={() => (
                            <CorsiList />
                        )} />

                        <Route exact path={superAdminRoute+"/corsi/new"} render={() => (
                            <AddNewCorso />
                        )} />

                        <Route exact path={superAdminRoute+"/corsi/edit/:id"} render={(routeProps) => (
                            <EditCorso {...routeProps} />
                        )} />

                        <Route render={() => <Page404 goTo={superAdminRoute} />} />

                    </Switch>
                        
                </div>
            </Router>
        </div>
    }
}
