'use strict';

import React from "react";
import DatasetSourceStore from "../../../../stores/DatasetSourceStore";
import NamespaceStore from "../../../../stores/NamespaceStore";
import Actions from "../../../../actions/Actions";
import Void from "../../../../vocabulary/Void";
import Utils from "../../../../utils/Utils";
import LoadingWrapper from "../../../misc/LoadingWrapper";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

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

    format(cell, row) {
        return '<a href="'+cell+'" target="_blank">'+NamespaceStore.getShortForm(cell)+'</a> ';
    };

    render() {
        if (this.state.data.length === 0) {
            return <div/>;
        }
        var data = this.state.data
            .filter(r => (!r.hasOwnProperty('@type')))
            .map(r => {
                return {
                    'property': Utils.getJsonLdFirst(r[Void.PROPERTY],"@id"),
                    'triples': Utils.getJsonLdFirst(r[Void.TRIPLES],"@value"),
                    'distinctSubjects': Utils.getJsonLdFirst(r[Void.DISTINCT_SUBJECTS],['@value']),
                    'distinctObjects': Utils.getJsonLdFirst(r[Void.DISTINCT_OBJECTS],['@value'])
                }
            });

        const numberColWidth = "150";
        return (
            <BootstrapTable data={data} striped={true} hover={true} >
                <TableHeaderColumn dataField="property" isKey={true} dataSort={true} dataFormat={this.format}>property</TableHeaderColumn>
                <TableHeaderColumn dataField="triples" dataSort={true} width={numberColWidth}>triples</TableHeaderColumn>
                <TableHeaderColumn dataField="distinctSubjects" dataSort={true} width={numberColWidth}>dist. subjs</TableHeaderColumn>
                <TableHeaderColumn dataField="distinctObjects" dataSort={true} width={numberColWidth}>dist. objs</TableHeaderColumn>
            </BootstrapTable>
        );
    };
}

export default LoadingWrapper(PropertyPartitionWidget, {maskClass: 'mask-container'});
