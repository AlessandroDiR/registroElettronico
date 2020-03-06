import React from "react"
import { NavLink, Route, Router, Switch } from "react-router-dom"
import { routerHistory } from ".."
import Firma from "./Firma"
import LessonsCalendar from "./LessonsCalendar"
import SceltaCorso from "./SceltaCorso"
import SceltaClasse from "./SceltaClasse"
import LogoCorso from "./LogoCorso"

export default class Main extends React.Component{

    focusInput = () => {
        let input = document.getElementById("mainInput") as HTMLInputElement

        if(input)
            input.focus()
    }

    render(): JSX.Element{
        let idCorso = sessionStorage.getItem("corso"),
        classe = sessionStorage.getItem("classe")

        if(!idCorso)
            return <SceltaCorso />

        if(!classe)
            return <SceltaClasse />

        return <div className="container-fluid" onClick={this.focusInput}>

            <Router history={routerHistory}>
                <div className="row">
                    <div className="col-3 bg-blue p-0 menu">
                        
                        <LogoCorso idCorso={sessionStorage.getItem("corso")} />

                        <NavLink className="router-link" activeClassName="active" onClick={() => routerHistory.push("/")} exact to="/firme/">
                            <span>Home</span>
                        </NavLink>
                        <NavLink className="router-link" activeClassName="active" onClick={() => routerHistory.push("/calendar")} exact to="/firme/calendar">
                            <span>Calendario</span>
                        </NavLink>
                    </div>

                    <Switch>
                        <Route exact path="/firme/" render={() => (
                            <Firma />
                        )} />

                        <Route exact path="/firme/calendar" render={() => (
                            <LessonsCalendar />
                        )} />
                    </Switch>
                        
                </div>
            </Router>
        </div>
    }
}