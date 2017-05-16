'use strict';

import React from "react";
import DatasetSourceStore from "../../../../stores/DatasetSourceStore";
import NamespaceStore from "../../../../stores/NamespaceStore";
import Actions from "../../../../actions/Actions";
import LoadingWrapper from "../../../misc/LoadingWrapper";
import {Badge} from "react-bootstrap";
import Hierarchy from "./Hierarchy";

class SkosWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            lst: [],
            tree: [],
            loadedQueries: []
        }
    };

    componentWillMount() {
        this.unsubscribe = DatasetSourceStore.listen(this._onDataLoaded.bind(this));
    };

    _onDataLoaded = (data) => {
        if (data === undefined) {
            return
        }

        const queryType = "skos/get_vocabulary_type";

        if (data.action === Actions.selectDatasetSource) {
            this.props.loadingOn();
            Actions.executeQueryForDatasetSource(data.datasetSource.hash, queryType);
        } else {
            if (data.queryName === queryType) {
                this.setState({
                    type: data.jsonLD,
                });
            }
            this.props.loadingOff();
        }
    };

    componentWillUnmount() {
        this.unsubscribe();
    };

    renderType() {
        let type = 'unknown';
        if (this.state.type && this.state.type[0]) {
            type = NamespaceStore.getShortForm(this.state.type[0]['@id']);
        }
        return <Badge bsClass="badge badge-info">{type}</Badge>;
    };

    render() {
        var list = []
        return ( <div>{this.renderType()}
           <Hierarchy/>
        </div> );
    };
}

export default LoadingWrapper(SkosWidget, {maskClass: 'mask-container'});
