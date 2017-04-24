'use strict';

import React from "react";
import DatasetSourceStore from "../../../../stores/DatasetSourceStore";
import Actions from "../../../../actions/Actions";
import {BarChart, Bar, Brush, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

class SkosWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    };

    componentWillMount() {
        this.unsubscribe = DatasetSourceStore.listen(this._onDataLoaded);
    };

    _onDataLoaded = (data) => {
        if ( data === undefined ) {
            return
        }

        const queryHierarchy = "skos_widget/get_concept_hierarchy";

        if ( data.action === Actions.selectDatasetSource ) {
            Actions.executeQueryForDatasetSource(data.datasetSource.hash, queryHierarchy);
        } else  if ( data.queryName === queryHierarchy ) {
            this.setState({
                data:JSON.stringify(data.jsonLD)
            });
        }
    };

    componentWillUnmount() {
        this.unsubscribe();
    };

    render() {
        return <div>{this.state.data}</div>;
    };
}

export default SkosWidget;
