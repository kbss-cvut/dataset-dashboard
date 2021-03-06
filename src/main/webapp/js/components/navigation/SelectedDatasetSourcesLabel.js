'use strict';

import * as React from "react";
import {DatasetSourceStore} from "../../stores/DatasetSourceStore";
import DatasetSourceLabel from "../misc/DatasetSourceLabel";

export class SelectedDatasetSourcesLabel extends React.Component {

    componentWillMount() {
        this.unsubscribe = DatasetSourceStore.listen((data) => this.reload());
        this.reload()
    };

    componentWillUnmount() {
        this.unsubscribe();
    };

    reload() {
        this.setState( { datasetSource: DatasetSourceStore.getSelectedDatasetSource() } )
    };

    render() {
        return (<DatasetSourceLabel datasetSource={this.state.datasetSource}/>)
    }
}

