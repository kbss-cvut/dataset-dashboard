'use strict';

import React from "react";
import DatasetSourceStore from "../stores/DatasetSourceStore";
import Actions from "../actions/Actions";
import {Panel} from "react-bootstrap";
import LoadingWrapper from "./misc/LoadingWrapper";
import DatasetSourceLink from "./DatasetSourceLink";
import FilterableTree from './misc/FilterableTree';

class DatasetSourceTree extends FilterableTree {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
    };

    componentWillMount() {
        this.props.loadingOn();
        Actions.getAllDatasetSources();
        this.unsubscribe = DatasetSourceStore.listen(this._onDataLoaded);
    };

    _onDataLoaded = (data) => {
        if (data === undefined) {
            return
        }

        if (data.action == Actions.getAllDatasetSources) {
            this.props.loadingOff();
            this.setState({
                data: data.datasetSources,
            });
        }

        if (( data.action == Actions.registerDatasetSourceEndpoint )
            || ( data.action == Actions.registerDatasetSourceNamedGraph )
            || ( data.action == Actions.registerDatasetUrl )) {
            Actions.getAllDatasetSources();
        }
    };

    componentWillUnmount() {
        this.unsubscribe();
    };

    render() {
        const header = <div>Filter Dataset Source</div>;
        return (<Panel header={header}>
            <FilterableTree
                data={this.state.data}
                height={400}
                selectable={false}
                expandable={true}
                showIcon={false}
                treeCheckable={false}
                createKey={(item) => item.endpointUrl + " " + item.graphId}
                createView={(item) => <DatasetSourceLink datasetSource={item}/>}
            />
        </Panel>);
    }
}
export default LoadingWrapper(DatasetSourceTree, {maskClass: 'mask-container'});
