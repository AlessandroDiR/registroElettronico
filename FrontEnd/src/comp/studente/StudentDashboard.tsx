import React from "react"
import { NavLink, Route, Router, Switch } from "react-router-dom"
import { routerHistory } from "../.."
import LogoCorso from "../LogoCorso"
import Page404 from "../Page404"
import { studentRoute } from "../../utilities"
import Footer from "../Footer"
import LoginStudent from "./LoginStudent"
import { IStudent } from "../../models/IStudent"
import StageList from "./StageList"
import Home from "./Home"

export default class StudentDashboard extends React.Component{

    componentWillUnmount = () => {
        sessionStorage.removeItem("studentSession")
    }

    render(): JSX.Element{

        let session = sessionStorage.getItem("studentSession")
        
        if(!session)
            return <LoginStudent />

        let studente = JSON.parse(session) as IStudent

        return <div className="container-fluid">
            <Router history={routerHistory}>
                <div className="row">
                    <div className="col-3 bg-blue p-0 menu">
                        
                        <LogoCorso idCorso={0} />

                        <NavLink className="router-link" activeClassName="active" onClick={() => routerHistory.push(studentRoute+"/home")} to={studentRoute+"/home"}>
                            <span><i className="fal fa-home-alt fa-fw mr-1"></i> Home</span>
                        </NavLink>
                        <NavLink className="router-link" activeClassName="active" onClick={() => routerHistory.push(studentRoute+"/stage")} to={studentRoute+"/stage"}>
                            <span><i className="fal fa-briefcase fa-fw mr-1"></i> Stage</span>
                        </NavLink>
                        <NavLink className="router-link" activeClassName="active" onClick={() => {
                            sessionStorage.removeItem("studentSession")
                            routerHistory.push(studentRoute)
                        }} exact to={studentRoute+"/login"}>
                            <span><i className="fal fa-power-off fa-fw mr-1"></i> Esci</span>
                        </NavLink>

                        <Footer inMenu />
                    </div>
  
                    <Switch>
                        <Route exact path={studentRoute} render={() => {
                            routerHistory.push(studentRoute+"/home")

                            return null
                        }} />

                        <Route exact path={studentRoute+"/home"} render={() => (
                            <Home studente={studente} />
                        )} />

                        <Route exact path={studentRoute+"/stage"} render={() => (
                            <StageList studente={studente} />
                        )} />

                        <Route render={() => <Page404 goTo={studentRoute} />} />

                    </Switch>
                        
                </div>
            </Router>
        </div>
    }
}
