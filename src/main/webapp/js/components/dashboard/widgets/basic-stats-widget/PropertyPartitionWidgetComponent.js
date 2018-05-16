'use strict';

import React from "react";
import Reflux from "reflux";
import { TableHeaderColumn } from 'react-bootstrap-table';

import NamespaceStore from "../../../../stores/NamespaceStore";
import Void from "../../../../vocabulary/Void";
import Utils from "../../../../utils/Utils";
import Table from './Table';

export default class PropertyPartitionWidgetComponent extends Reflux.Component {

    constructor(props)
    {
        super(props);
        this.state = {};
        this.store = NamespaceStore;
    }

    format(cell, row) {
        const n = this.state.namespaces;
        return <a href="'+cell+'" target="_blank">{Utils.getShortForm(n,cell)}</a>;
    };

    render() {
            var data = this.props.data
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
            columns.push(<TableHeaderColumn key="property" dataField="property" isKey={true} dataSort={true} dataFormat={(cell,row)=>this.format(cell,row)}>property</TableHeaderColumn>)
            columns.push(<TableHeaderColumn key="triples" dataField="triples" dataSort={true} width={numberColWidth}>triples</TableHeaderColumn>)
            columns.push(<TableHeaderColumn key="distinctSubjects" dataField="distinctSubjects" dataSort={true} width={numberColWidth}>dist.sbj</TableHeaderColumn>)
            columns.push(<TableHeaderColumn key="distinctObjects" dataField="distinctObjects" dataSort={true} width={numberColWidth}>dist.obj</TableHeaderColumn>)
            return(<Table data={data} columns={columns} sortName="triples"/>);
    };
}
