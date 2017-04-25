'use strict';

import React from "react";
import DatasetSourceStore from "../../../../stores/DatasetSourceStore";
import Actions from "../../../../actions/Actions";
import SimpleTable from 'react-simple-table';
import Void from "../../../../vocabulary/Void";


class PropertyPartitionWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        }
    };

    componentWillMount() {
        // Actions.registerDatasetSourceEndpoint("http://onto.fel.cvut.cz/rdf4j-server/repositories/eurovoc-thesaurus");
        if (this.props.datasetSourceId) {
            Actions.executeQueryForDatasetSource(this.props.datasetSourceId, "void/property_partitions");
            this.unsubscribe = DatasetSourceStore.listen(this._onDataLoaded);
        }
    };

    _onDataLoaded = (data) => {
        if (data === undefined) {
            return
        }

        if (data.queryName === "void/property_partitions") {
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
                    'property': r[Void.PROPERTY]['@id'],
                    'triples': r[Void.TRIPLES],
                    'distinctSubjects': r[Void.DISTINCT_SUBJECTS],
                    'distinctObjects': r[Void.DISTINCT_OBJECTS]
                }
            });

        return (
            <SimpleTable columns={[
                {columnHeader: 'property', path: 'property'},
                {columnHeader: 'triples', path: 'triples'},
                {columnHeader: 'distinctSubjects', path: 'distinctSubjects'},
                {columnHeader: 'distinctObjects', path: 'distinctObjects'}
            ]} data={data}/>);
    };
}

export default PropertyPartitionWidget;
