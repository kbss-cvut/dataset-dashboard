import React from "react";
import Actions from "./actions/Actions";
import {HashRouter as Router, Route, Switch} from "react-router-dom";
import PersistentDatasetDashboardController from "./components/dashboard/PeristentDatasetDashboardController";
import {DatasetDashboardController} from "./components/dashboard/DatasetDashboardController";
import NamespaceManagementController from "./components/namespaces/NamespaceManagementController";

Actions.refreshDatasetSources();

export const App = () => {
    return <Router>
        <div>
            <Switch>
                <Route path='/dashboard/online' component={PersistentDatasetDashboardController}/>
                <Route path='/dashboard' component={DatasetDashboardController}/>
                {/*<Route path='/dataset-sources' component={DatasetSourceManagementController}/>*/}
                <Route path='/namespaces' component={NamespaceManagementController}/>
                <Route component={DatasetDashboardController} />
            </Switch>
        </div>
    </Router>;
};
