'use strict';

import React from "react";
import DatasetSourceStore from "../../../../stores/DatasetSourceStore";
import NamespaceStore from "../../../../stores/NamespaceStore";
import Actions from "../../../../actions/Actions";
import Void from "../../../../vocabulary/Void";
import Utils from "../../../../utils/Utils";
import LoadingWrapper from "../../../misc/LoadingWrapper";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


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
            Actions.executeQueryForDatasetSource(data.datasetSource.hash, "void/class_partitions");
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


    render() {
        if (this.state.data.length === 0) {
            return <div/>;
        }
        var data = this.state.data//['@graph']
            .filter(r => (!r.hasOwnProperty('@type')))
            .map(r => {
                return {
                    'class': NamespaceStore.getShortForm(Utils.getJsonLdFirst(r[Void.CLASS],'@id')),
                    'entities': Utils.getJsonLdFirst(r[Void.ENTITIES], '@value')
                }
            });
        const numberColWidth = "200" ;
        return (
        <BootstrapTable data={data} striped={true} hover={true}>
            <TableHeaderColumn dataField="class" isKey={true} dataSort={true}>class</TableHeaderColumn>
            <TableHeaderColumn dataField="entities" dataSort={true} width={numberColWidth}>entities</TableHeaderColumn>
        </BootstrapTable>
        );
    };
}

export default LoadingWrapper(BasicStatsWidget, {maskClass: 'mask-container'});
