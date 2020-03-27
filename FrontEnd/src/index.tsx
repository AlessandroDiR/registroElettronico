import React from "react"
import ReactDOM from "react-dom"
import { createHashHistory } from "history"
import "./index.scss"
import * as serviceWorker from "./serviceWorker"
import Main from "./comp/Main"
import { Router, Switch, Route } from "react-router-dom"
import Dashboard from "./comp/admin/Dashboard"
import UserApplication from "./comp/mobile/UserApplication"
import Page404 from "./comp/Page404"
import moment from "moment"
import "moment/locale/it"
import SuperDashboard from "./comp/superadmin/SuperDashboard"
import { superAdminRoute, adminRoute } from "./utilities"
import DashboardCasa from "./comp/firmacasa/DashboardCasa"
import Docs from "./comp/Docs"

moment.locale("it")

export const routerHistory = createHashHistory()

ReactDOM.render(<Router history={routerHistory}>
    <Switch>
        <Route exact path="/" render={() => {
            routerHistory.push("/firme/")

            return null
        }} />

        <Route path="/firme/" render={() => (
            <Main />
        )} />

        <Route path={adminRoute} render={() => (
            <Dashboard />
        )} />

        <Route path="/userprofile" render={() => (
            <UserApplication />
        )} />

        <Route path={superAdminRoute} render={() => (
            <SuperDashboard />
        )} />

        <Route path="/firmacasa" render={() => (
            <DashboardCasa />
        )} />

        <Route exact path="/documentazione" render={() => (
            <Docs />
        )} />

        <Route render={() => <Page404 goTo="/" />} />
    </Switch>
</Router>, document.getElementById("root"))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
