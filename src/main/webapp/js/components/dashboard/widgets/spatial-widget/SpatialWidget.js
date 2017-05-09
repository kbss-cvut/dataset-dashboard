'use strict';

import React from "react";
import DatasetSourceStore from "../../../../stores/DatasetSourceStore";
import Actions from "../../../../actions/Actions";
import {TreeNode} from "rc-tree";
import LoadingWrapper from "../../../misc/LoadingWrapper";




class SpatialWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        }
    };

    componentWillMount() {
        this.unsubscribe = DatasetSourceStore.listen(this._onDataLoaded);
    };

    _onDataLoaded = (data) => {
        if (data === undefined) {
            return
        }
        if (data.action === Actions.selectDatasetSource) {
            this.props.loadingOn();
            Actions.executeQueryForDatasetSource(data.datasetSource.hash, "spatial/get_feature_geometry");
        } else if (data.queryName === "spatial/get_feature_geometry") {
            this.setState({
                data: data.jsonLD
            });
            this.props.loadingOff();
        }
    };

    componentWillUnmount() {
        this.unsubscribe();
    };

    render() {

        //var data = this.state.data
        if (this.state.data.length === 0) {
            var mymap = L.map('mapid').setView([51.505, -0.09], 13);
            return <div id="mapid"/>;
        }

        return (
            <div>
                Hic sunt leones + data
            </div>

        );
    };

}

export default LoadingWrapper(SpatialWidget, {maskClass: 'mask-container'});
