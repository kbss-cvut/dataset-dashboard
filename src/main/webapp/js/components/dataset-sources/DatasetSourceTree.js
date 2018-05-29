'use strict';

import * as React from "react";
import {DatasetSourceStore} from "../../stores/DatasetSourceStore";
import Actions from "../../actions/Actions";
import LoadingWrapper from "../misc/LoadingWrapper";
import DatasetSourceLink from "../misc/DatasetSourceLink";
import DatasetSourceFilterableTreeComponent from '../misc/DatasetSourceFilterableTreeComponent';

class DatasetSourceTree extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
    };

    componentWillMount() {
        console.log("mounting");
        this.state.data = DatasetSourceStore.getAllDatasetSources();
        this.unsubscribe = DatasetSourceStore.listen(this._onDataLoaded);
        console.log("mounted");
    };

    _onDataLoaded = (data) => {
        console.log("data loaded");

        if (data === undefined) {
            return
        }

        if (data.action == Actions.refreshDatasetSources) {
            this.props.loadingOff();
            console.log("state changed");
            this.setState({
                data: data.datasetSources,
            });
        }
        console.log("data processed");
    };

    componentWillUnmount() {
        this.unsubscribe();
    };

    render() {
        const comp= (this.state.data ?
            <DatasetSourceFilterableTreeComponent
                data={this.state.data}
                height={400}
                selectable={false}
                expandable={true}
                showIcon={false}
                treeCheckable={false}
                createKey={(item) => item.tempid + " " + item.endpointUrl + " " + item.graphId}
                createView={(item) => <DatasetSourceLink datasetSource={item}/>}
            /> : <div>No data</div>);

        return comp;
    }
}

const component = LoadingWrapper(DatasetSourceTree, {maskClass: 'mask-container'});
export default component;
