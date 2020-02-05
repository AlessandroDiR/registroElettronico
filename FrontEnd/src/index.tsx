import React from 'react';
import ReactDOM from 'react-dom';
import { createHashHistory } from 'history';
import './index.scss';
import 'antd/dist/antd.css';
import * as serviceWorker from './serviceWorker';
import Main from './comp/Main';
import { Router, Switch, Route } from 'react-router-dom';
import Dashboard from './comp/admin/Dashboard';
import UserApplication from './comp/mobile/UserApplication';
import DocentiDashboard from './comp/docenti/DocentiDashboard';
export const routerHistory = createHashHistory();


ReactDOM.render(<Router history={routerHistory}>
    <Switch>
        <Route exact path="/" render={() => {
            routerHistory.push("/firme/")

            return null
        }} />

        <Route path="/firme/" render={() => (
            <Main />
        )} />

        <Route path="/adminpanel" render={() => (
            <Dashboard />
        )} />

        <Route path="/userprofile" render={() => (
            <UserApplication />
        )} />

        <Route path="/docentipanel" render={() => (
            <DocentiDashboard />
        )} />
    </Switch>
</Router>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
