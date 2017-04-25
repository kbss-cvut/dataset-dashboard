'use strict';

import React from "react";
import DatasetSourceStore from "../../../../stores/DatasetSourceStore";
import Actions from "../../../../actions/Actions";
import SimpleTable from 'react-simple-table';
import Void from "../../../../vocabulary/Void";


class BasicStatsWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        }
    };

    componentWillMount() {
        // Actions.registerDatasetSourceEndpoint("http://onto.fel.cvut.cz/rdf4j-server/repositories/eurovoc-thesaurus");
        if (this.props.datasetSourceId) {
            Actions.executeQueryForDatasetSource(this.props.datasetSourceId, "void/class_partitions");
            this.unsubscribe = DatasetSourceStore.listen(this._onDataLoaded);
        }
    };

    _onDataLoaded = (data) => {
        if (data === undefined) {
            return
        }

        if (data.queryName === "void/class_partitions") {
            this.setState({
                data: data.jsonLD
            });
        }
    };

    componentWillUnmount() {
        this.unsubscribe();
    };


    render() {
        if (this.state.data.length === 0) {
            return <div/>;
        }
        var data = this.state.data['@graph']
            .filter(r => (!r.hasOwnProperty('@type')))
            .map(r => {
                return {
                    'class': r[Void.CLASS]['@id'],
                    'entities': r[Void.ENTITIES]
                }
            });

        return (
            <SimpleTable columns={[
                {columnHeader: 'class', path: 'class'},
                {columnHeader: 'entities', path: 'entities'}
            ]} data={data}/>);
    };
}

export default BasicStatsWidget;
