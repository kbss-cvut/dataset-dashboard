'use strict';

import React from "react";
import DatasetSourceStore from "../../../stores/DatasetSourceStore";
import Actions from "../../../actions/Actions";
import LoadingWrapper from "../../misc/LoadingWrapper";

class SingleSparqlWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        }
    };

    componentDidMount() {
        this.unsubscribe = DatasetSourceStore.listen(this._onDataLoaded);
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
        this.unsubscribe();
    };

    render() {
        if (this.state.data.length === 0) {
            return <div/>;
        }
        return( <div> {this.props.widget(this.state.data)} </div>);
    };
}

export default LoadingWrapper(SingleSparqlWidget, {maskClass: 'mask-container'});
