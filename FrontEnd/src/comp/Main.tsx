import React from "react"
import { NavLink, Route, Router, Switch } from 'react-router-dom';
import { routerHistory } from ".."
import HomeComponent from "./HomeComponent";
import LessonsCalendar from "./LessonsCalendar";

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
                    <div className="col-12 col-lg-3 bg-danger p-0 menu">
                        <div className="logo-block px-3 py-4">
                            <img src="https://iscrizione.fitstic.it/wp-content/uploads/2015/07/Senza-titolo-1.png" height="100" className="mx-auto d-block logo" alt="logo" />
                        </div>

                        <NavLink className="router-link" activeClassName="active" onClick={() => routerHistory.push("/")} exact to="/firme/">
                            <span>Home</span>
                        </NavLink>
                        <NavLink className="router-link" activeClassName="active" onClick={() => routerHistory.push("/calendar")} exact to="/firme/calendar">
                            <span>Lezioni</span>
                        </NavLink>
                    </div>

                    
                        <Switch>
                            <Route exact path="/firme/" render={() => (
                                <HomeComponent />
                            )} />

                            <Route exact path="/firme/calendar" render={() => (
                                <div className="col-9 px-5 py-4" id="mainBlock">
                                    <div>
                                        <h3 className="mb-2 text-center">Lezioni di questo mese</h3>
                                        <LessonsCalendar />
                                    </div>
                                </div>
                            )} />
                        </Switch>
                        
                    </div>
            </Router>
        </div>
    }
}