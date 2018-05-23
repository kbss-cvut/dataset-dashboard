'use strict';

import React from "react";
import Reflux from "reflux";
import { TableHeaderColumn } from 'react-bootstrap-table';

import NamespaceStore from "../../../../stores/NamespaceStore";
import Void from "../../../../vocabulary/Void";
import RenderUtils from "./RenderUtils";
import Utils from "../../../../utils/Utils";
import Table from './Table';

export default class ClassPartitionWidgetComponent extends Reflux.Component {

    constructor(props)
    {
        super(props);
        this.state = {};
        this.store = NamespaceStore;
    }

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
        columns.push(<TableHeaderColumn key="select" dataField="select" dataFormat={(cell,row) => RenderUtils.formatSelect( cell,row.class, excludedEntities,(e) => this.props.onExcludeEntities(e))} width={actionColWidth}></TableHeaderColumn>)
        columns.push(<TableHeaderColumn key="class" dataField="class" filter={ { type: 'TextFilter' } } isKey={true} dataSort={true} dataFormat={(cell,row) => RenderUtils.format(this.state.namespaces,cell,row.select)}>class</TableHeaderColumn>)
        columns.push(<TableHeaderColumn key="entities" dataField="entities" dataSort={true} width={numberColWidth}>instances</TableHeaderColumn>)
        return(
            <Table data={data} selectColumnDataField="select" columns={columns} sortName="entities"/>
        );
    };
}
