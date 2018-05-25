'use strict';

import React from "react";
import Reflux from "reflux";
import { TableHeaderColumn } from 'react-bootstrap-table';

import NamespaceStore from "../../../../stores/NamespaceStore";
import Void from "../../../../vocabulary/Void";
import Utils from "../../../../utils/Utils";
import Table from './Table';

import ExcludeButton from "./ExcludeButton";
import IncludedExcludedResource from "./IncludedExcludedResource";

export default class ClassPartitionWidgetComponent extends Reflux.Component {

    constructor(props)
    {
        super(props);
        this.state = {};
        this.store = NamespaceStore;
    }

    render() {
        const excludedEntities = this.props.excludedEntities;
        const data = this.props.data//['@graph']
            .filter(r => (!r.hasOwnProperty('@type')))
            .map(r => {
                const id = Utils.getJsonLdFirst(r[Void.CLASS],'@id');
                return {
                    'class': id,
                    'entities': Utils.getJsonLdFirst(r[Void.ENTITIES], '@value')
                }
            });
        const actionColWidth = "50" ;
        const numberColWidth = "100" ;
        const columns=[];
        columns.push(<TableHeaderColumn
            key="select"
            dataField="class"
            dataFormat={(cell,row) =>
              {return <ExcludeButton
                  entityIri={cell}
                  excludedEntities={excludedEntities}
                  onExcludeEntities={this.props.onExcludeEntities}/>}}
            width={actionColWidth}>
        </TableHeaderColumn>)
        columns.push(<TableHeaderColumn
            key="class"
            dataField="class"
            filter={ { type: 'TextFilter' } }
            isKey={true}
            dataSort={true}
            dataFormat={(cell,row) =>
                {return <IncludedExcludedResource
                    entityIri={cell}
                    label={Utils.getShortForm(this.state.namespaces, cell)}
                    excluded={excludedEntities.includes(cell)}></IncludedExcludedResource> }}>
                    class
        </TableHeaderColumn>)
        columns.push(<TableHeaderColumn key="entities" dataField="entities" dataSort={true} width={numberColWidth}>instances</TableHeaderColumn>)
        return(
            <Table data={data} selectColumnDataField="select" columns={columns} sortName="entities"/>
        );
    };
}
