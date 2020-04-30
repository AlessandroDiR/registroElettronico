import React from "react"
import { NavLink, Route, Router, Switch } from "react-router-dom"
import { routerHistory } from "../.."
import LogoCorso from "../LogoCorso"
import Page404 from "../Page404"
import { stageRoute } from "../../utilities"
import Footer from "../Footer"
import LoginStage from "./LoginStage"
import { IStudent } from "../../models/IStudent"
import Home from "./Home"

export default class StageDashboard extends React.Component{

    componentWillUnmount = () => {
        sessionStorage.removeItem("stageSession")
    }

    render(): JSX.Element{

        let session = sessionStorage.getItem("stageSession")
        
        if(!session)
            return <LoginStage />

        let studente = JSON.parse(session) as IStudent

        return <div className="container-fluid">
            <Router history={routerHistory}>
                <div className="row">
                    <div className="col-3 bg-blue p-0 menu">
                        
                        <LogoCorso idCorso={0} />

                        <NavLink className="router-link" activeClassName="active" onClick={() => routerHistory.push(stageRoute+"/home")} to={stageRoute+"/home"}>
                            <span><i className="fal fa-home-alt fa-fw mr-1"></i> Home</span>
                        </NavLink>
                        <NavLink className="router-link" activeClassName="active" onClick={() => {
                            sessionStorage.removeItem("stageSession")
                            routerHistory.push(stageRoute)
                        }} exact to={stageRoute+"/login"}>
                            <span><i className="fal fa-power-off fa-fw mr-1"></i> Esci</span>
                        </NavLink>

                        <Footer inMenu={true} />
                    </div>
  
                    <Switch>
                        <Route exact path={stageRoute} render={() => {
                            routerHistory.push(stageRoute+"/home")

                            return null
                        }} />

                        <Route exact path={stageRoute+"/home"} render={() => (
                            <Home studente={studente} />
                        )} />

                        <Route render={() => <Page404 goTo={stageRoute} />} />

                    </Switch>
                        
                </div>
            </Router>
        </div>
    }
}
