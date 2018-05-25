'use strict';

import React from "react";
import Reflux from "reflux";
import DatasetSourceStore from "../../../stores/DatasetSourceStore";
import DashboardContextStore from "../../../stores/DashboardContextStore";
import Actions from "../../../actions/Actions";
import LoadingWrapper from "../../misc/LoadingWrapper";

class SingleSparqlWidget extends Reflux.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        }
        this.store = DashboardContextStore;
    };

    componentDidMount() {
        this.unsubscribe1 = DatasetSourceStore.listen((data) => this._onDataLoaded(data));
        this.selectDatasetSource();
    };

    selectDatasetSource() {
        this.props.loadingOn();
        Actions.executeQueryForDatasetSource(
            DatasetSourceStore.getSelectedDatasetSource().id,
            this.props.query);
    }

    _onDataLoaded = (data) => {
        if (data === undefined) {
            return
        }
        if (data.action === Actions.selectDatasetSource) {
            this.selectDatasetSource()
        } else if (data.queryName === this.props.query) {
            this.setState({
                data: data.content
            });
            this.props.loadingOff();
        }
    };

    componentWillUnmount() {
        this.props.loadingOff();
        this.unsubscribe1();
    };

    render() {
        if (this.state.data.length === 0) {
            return <div/>;
        }
        return( <div> {this.props.widget(
            this.state.data,
            this.state.excludedEntities,
            Actions.excludeEntities)}
        </div>);
    };
}

export default LoadingWrapper(SingleSparqlWidget, {maskClass: 'mask-container'});
