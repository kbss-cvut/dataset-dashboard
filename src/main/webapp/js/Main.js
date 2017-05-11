'use strict';
// Have the imports here, so that the I18nStore is initialized before any of the components which might need it
import React from "react";
import {Router, Route, IndexRoute, browserHistory} from "react-router";
import DatasetDashboard from "./components/dashboard/DashboardController";

export default class Main extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div>
            <Router history={browserHistory}>
                <Route path='/' component={DatasetDashboard}/>
            </Router>
        </div>;
    }
}