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
        this.unsubscribe = DatasetSourceStore.listen(this._onDataLoaded);
    };

    _onDataLoaded = (data) => {
        if (data === undefined) {
            return
        }
        if (data.action === Actions.selectDatasetSource) {
            Actions.executeQueryForDatasetSource(data.datasetSource.hash, "void/class_partitions");
        } else if (data.queryName === "void/class_partitions") {
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
