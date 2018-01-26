'use strict';

import React from 'react'
import { render } from 'react-dom'
import {Router, Route, browserHistory} from "react-router";
import { BrowserRouter } from 'react-router-dom'
import DatasetDashboard from "./components/dashboard/DashboardController";
render((
    <BrowserRouter>
        <Router history={browserHistory}>
            <Route path='/dataset-dashboard' component={DatasetDashboard}/>
            <Route path='/dataset-dashboard?endpointUrl=:endpointUrl' component={DatasetDashboard}/>
            <Route path='/dataset-dashboard?endpointUrl=:endpointUrl&graphIri=:graphIri' component={DatasetDashboard}/>
        </Router>
    </BrowserRouter>
), document.getElementById('content'));