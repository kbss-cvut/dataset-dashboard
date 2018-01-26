'use strict';

import React from "react";
import DatasetSourceStore from "../../../../stores/DatasetSourceStore";
import NamespaceStore from "../../../../stores/NamespaceStore";
import Actions from "../../../../actions/Actions";
import Void from "../../../../vocabulary/Void";
import Utils from "../../../../utils/Utils";
import LoadingWrapper from "../../../misc/LoadingWrapper";
import { TableHeaderColumn } from 'react-bootstrap-table';
import Table from './Table';

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
            Actions.executeQueryForDatasetSource(data.datasetSource.id, "void/property_partitions");
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
        const numberColWidth = "80" ;
        const columns=[];
        columns.push(<TableHeaderColumn key="property" dataField="property" isKey={true} dataSort={true} dataFormat={this.format}>property</TableHeaderColumn>)
        columns.push(<TableHeaderColumn key="triples" dataField="triples" dataSort={true} width={numberColWidth}>triples</TableHeaderColumn>)
        columns.push(<TableHeaderColumn key="distinctSubjects" dataField="distinctSubjects" dataSort={true} width={numberColWidth}>dist.sbj</TableHeaderColumn>)
        columns.push(<TableHeaderColumn key="distinctObjects" dataField="distinctObjects" dataSort={true} width={numberColWidth}>dist.obj</TableHeaderColumn>)
        return(<Table data={data} columns={columns} sortName="triples"/>);
    };
}

export default LoadingWrapper(PropertyPartitionWidget, {maskClass: 'mask-container'});
