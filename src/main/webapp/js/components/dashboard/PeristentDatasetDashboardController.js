'use strict';

import { parse } from 'qs'
import React from "react";
import DatasetSourceStore from "../../stores/DatasetSourceStore";
import Actions from "../../actions/Actions";
import DatasetDashboardController from "./DatasetDashboardController";
import LoadingWrapper from "../misc/LoadingWrapper";

class PersistentDatasetDashboardController extends React.Component {

    componentDidMount() {
        this.unsubscribe = DatasetSourceStore.listen(this._onDataLoaded);
        this.registerDatasetSource();
    };

    registerDatasetSource() {
        this.props.loadingOn();
        const { location } = this.props
        const query = parse(location.search.substr(1))
        if ( query.endpointUrl && query.graphIri) {
            Actions.registerDatasetSourceNamedGraph(query.endpointUrl,query.graphIri);
            this.props.loadingOff();
        } else if ( query.endpointUrl ) {
            Actions.registerDatasetSourceEndpoint(query.endpointUrl);
            this.props.loadingOff();
        }
    }

    _onDataLoaded = (data) => {
        if (data === undefined) {
            return
        }

        if (( data.action == Actions.registerDatasetSourceEndpoint )
            || ( data.action == Actions.registerDatasetSourceNamedGraph )
            || ( data.action == Actions.registerDatasetUrl )) {
            Actions.selectDatasetSource(data.datasetSource);
        }
    }

    componentWillUnmount() {
        this.unsubscribe();
    };

    render() {
        return (<DatasetDashboardController/>)
    }
}

export default LoadingWrapper(PersistentDatasetDashboardController, {maskClass: 'mask-container'});