'use strict';

import React from "react";
import NamespaceStore from "../../../../stores/NamespaceStore";
import Void from "../../../../vocabulary/Void";
import Utils from "../../../../utils/Utils";
import { TableHeaderColumn } from 'react-bootstrap-table';
import Table from './Table';
import SingleSparqlWidget from '../SingleSparqlWidget';

const ClassPartitionWidget = () =>
    ( <SingleSparqlWidget
        query="void/class_partitions"
        widget={(data) => ( <ClassPartitionWidgetUI data={data}/>)}/> );

class ClassPartitionWidgetUI extends React.Component {

    format(cell, row) {
        return '<a href="'+cell+'" target="_blank">'+NamespaceStore.getShortForm(cell)+'</a> ';
    };

    render() {
        "void/class_partitions"
        var data = this.props.data//['@graph']
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
        return(
            <Table data={data} columns={columns} sortName="entities"/>
        );
    };
}

export default ClassPartitionWidget;
