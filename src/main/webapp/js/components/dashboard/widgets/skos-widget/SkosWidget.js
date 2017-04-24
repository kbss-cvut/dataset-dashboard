'use strict';

import React from "react";
import DatasetSourceStore from "../../../../stores/DatasetSourceStore";
import Actions from "../../../../actions/Actions";
import {BarChart, Bar, Brush, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

class SkosWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        }
    };

    componentWillMount() {
        // Actions.registerDatasetSourceEndpoint("http://onto.fel.cvut.cz/rdf4j-server/repositories/eurovoc-thesaurus");
        if (this.props.datasetSourceId) {
            Actions.executeQueryForDatasetSource(this.props.datasetSourceId,"skos_widget/get_concept_hierarchy");
            this.unsubscribe = DatasetSourceStore.listen(this._onDataLoaded);
        }
    };

    _onDataLoaded = (data) => {
        if (data === undefined) {
            return
        }

        if ( data.queryName === "skos_widget/get_concept_hierarchy") {
            this.setState({
                data:JSON.stringify(data.jsonLD)
            });
        }
        if ( data.queryName === "skos_widget/get_concept_hierarchy") {
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
