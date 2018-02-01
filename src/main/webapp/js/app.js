'use strict';

import React from "react";
import {HashRouter as Router, Route, Switch} from "react-router-dom";
import ReactDOM from "react-dom";
import DatasetDashboardController from "./components/dashboard/DatasetDashboardController";
import PersistentDatasetDashboardController from "./components/dashboard/PeristentDatasetDashboardController";
// import DatasetSourceManagementController from "./components/dataset-sources/DatasetSourceManagementController";
import NamespaceManagementController from "./components/namespaces/NamespaceManagementController";

ReactDOM.render((
    <Router>
        <div>
        <Switch>
            <Route path='/dashboard/online' component={PersistentDatasetDashboardController}/>
            <Route path='/dashboard' component={DatasetDashboardController}/>
            {/*<Route path='/dataset-sources' component={DatasetSourceManagementController}/>*/}
            <Route path='/namespaces' component={NamespaceManagementController}/>
            <Route component={DatasetDashboardController} />
        </Switch>
        </div>
    </Router>
), document.getElementById('content'));
