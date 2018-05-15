'use strict';

import React from "react";
import NamespaceStore from "../../../../stores/NamespaceStore";
import {Button,Glyphicon} from "react-bootstrap";
import Void from "../../../../vocabulary/Void";
import Utils from "../../../../utils/Utils";
import { TableHeaderColumn } from 'react-bootstrap-table';
import Table from './Table';

export default class ClassPartitionWidgetComponent extends React.Component {

    format(cell, row) {
        return '<a href="'+cell+'" target="_blank">'+(row.select ? '<del>' : '') + NamespaceStore.getShortForm(cell)+(row.select ? '</del>' : '') +'</a> ';
    };

    formatSelect(cell, row) {
        return <Button bsSize="xsmall" onClick={() => {
            const newExcludedEntities = this.props.excludedEntities.slice(0);
            if ( cell ) {
                const newX = newExcludedEntities.indexOf(row.class)
                if ( newX > -1 ) {
                    newExcludedEntities.splice(newX,1);
                }
            } else {
                if ( !newExcludedEntities.includes(row.class)) {
                    newExcludedEntities.push(row.class);
                }
            }
            this.props.onExcludeEntities(newExcludedEntities)
        }}>{cell ? <Glyphicon glyph="plus"/> : <Glyphicon glyph="minus"/>}</Button>;
    };

    render() {
        const  excludedEntities = this.props.excludedEntities;
        const data = this.props.data//['@graph']
            .filter(r => (!r.hasOwnProperty('@type')))
            .map(r => {
                const id = Utils.getJsonLdFirst(r[Void.CLASS],'@id');
                return {
                    'select': excludedEntities.includes(id),
                    'class': id,
                    'entities': Utils.getJsonLdFirst(r[Void.ENTITIES], '@value')
                }
            });
        const actionColWidth = "50" ;
        const numberColWidth = "100" ;
        const columns=[];
        columns.push(<TableHeaderColumn key="select" dataField="select" dataFormat={(cell,row) => this.formatSelect(cell,row)} width={actionColWidth}></TableHeaderColumn>)
        columns.push(<TableHeaderColumn key="class" dataField="class" isKey={true} dataSort={true} dataFormat={this.format}>class</TableHeaderColumn>)
        columns.push(<TableHeaderColumn key="entities" dataField="entities" dataSort={true} width={numberColWidth}>instances</TableHeaderColumn>)
        return(
            <Table data={data} columns={columns} sortName="entities"/>
        );
    };
}
