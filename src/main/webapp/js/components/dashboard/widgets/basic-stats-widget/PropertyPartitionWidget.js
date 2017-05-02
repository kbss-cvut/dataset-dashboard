'use strict';

import React from "react";
import DatasetSourceStore from "../../../../stores/DatasetSourceStore";
import NamespaceStore from "../../../../stores/NamespaceStore";
import Actions from "../../../../actions/Actions";
import SimpleTable from 'react-simple-table';
import Void from "../../../../vocabulary/Void";
import Utils from "../../../../utils/Utils";
import LoadingWrapper from "../../../misc/LoadingWrapper";


class PropertyPartitionWidget extends React.Component {
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
            Actions.executeQueryForDatasetSource(data.datasetSource.hash, "void/property_partitions");
        }
        if (data.queryName === "void/property_partitions") {
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
        if (this.state.data.length === 0) {
            return <div/>;
        }
        var data = this.state.data
            .filter(r => (!r.hasOwnProperty('@type')))
            .map(r => {
                return {
                    'property': NamespaceStore.getShortForm(Utils.getJsonLdFirst(r[Void.PROPERTY],"@id")),
                    'triples': Utils.getJsonLdFirst(r[Void.TRIPLES],"@value"),
                    'distinctSubjects': Utils.getJsonLdFirst(r[Void.DISTINCT_SUBJECTS],['@value']),
                    'distinctObjects': Utils.getJsonLdFirst(r[Void.DISTINCT_OBJECTS],['@value'])
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

export default LoadingWrapper(PropertyPartitionWidget, {maskClass: 'mask-container'});
