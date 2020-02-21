import React from "react"
import { NavLink, Route, Router, Switch } from 'react-router-dom'
import { routerHistory } from ".."
import Firma from "./Firma"
import LessonsCalendar from "./LessonsCalendar"
import SceltaCorso from "./SceltaCorso"
import SceltaClasse from "./SceltaClasse"

export default class Main extends React.Component{

    focusInput = () => {
        let input = document.getElementById("mainInput") as HTMLInputElement

        if(input)
            input.focus()
    }

    render(): JSX.Element{
        return <div className="container-fluid" onClick={this.focusInput}>


            <Router history={routerHistory}>
                <div className="row">
                    <div className="col-3 bg-blue p-0 menu">
                        <div className="logo-block px-3 py-4">
                            <img src="https://iscrizione.fitstic.it/wp-content/uploads/2015/07/Senza-titolo-1.png" height="100" className="mx-auto d-block logo" alt="logo" />
                        </div>

                        <NavLink className="router-link" activeClassName="active" onClick={() => routerHistory.push("/")} exact to="/firme/">
                            <span>Home</span>
                        </NavLink>
                        <NavLink className="router-link" activeClassName="active" onClick={() => routerHistory.push("/calendar")} exact to="/firme/calendar">
                            <span>Calendario</span>
                        </NavLink>
                    </div>

                    
                        <Switch>
                            <Route exact path="/firme/" render={() => {
                                let corso = sessionStorage.getItem("corso"),
                                classe = sessionStorage.getItem("classe")

                                if(!corso)
                                    return <SceltaCorso />

                                if(!classe)
                                    return <SceltaClasse />

                                return <Firma />
                            }} />

                            <Route exact path="/firme/calendar" render={() => (
                                        <LessonsCalendar />
                            )} />
                        </Switch>
                        
                    </div>
            </Router>
        </div>
    }
}