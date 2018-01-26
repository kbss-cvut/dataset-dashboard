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
            this.props.loadingOn();
            Actions.executeQueryForDatasetSource(data.datasetSource.id, "void/class_partitions");
        } else if (data.queryName === "void/class_partitions") {
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
        var data = this.state.data//['@graph']
            .filter(r => (!r.hasOwnProperty('@type')))
            .map(r => {
                return {
                    'class': Utils.getJsonLdFirst(r[Void.CLASS],'@id'),
                    'entities': Utils.getJsonLdFirst(r[Void.ENTITIES], '@value')
                }
            });
        const numberColWidth = "100" ;
        const columns=[];
        columns.push(<TableHeaderColumn key="class" dataField="class" isKey={true} dataSort={true} dataFormat={this.format}>class</TableHeaderColumn>)
        columns.push(<TableHeaderColumn key="entities" dataField="entities" dataSort={true} width={numberColWidth}>instances</TableHeaderColumn>)
        return(<Table data={data} columns={columns} sortName="entities"/>);
    };
}

export default LoadingWrapper(BasicStatsWidget, {maskClass: 'mask-container'});
