'use strict';

import React from "react";
import Reflux from "reflux";
import {TableHeaderColumn} from "react-bootstrap-table";

import NamespaceStore from "../../../../stores/NamespaceStore";
import Void from "../../../../vocabulary/Void";
import Utils from "../../../../utils/Utils";
import Table from "./Table";
import IncludedExcludedResource from "./IncludedExcludedResource";
import ExcludeButton from "./ExcludeButton";

export default class PropertyPartitionWidgetComponent extends Reflux.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.store = NamespaceStore;
    }

    render() {
        const excludedEntities = this.props.excludedEntities;
        const data = this.props.data
            .filter(r => (!r.hasOwnProperty('@type')))
            .map(r => {
                const id = Utils.getJsonLdFirst(r[Void.PROPERTY],'@id');
                return {
                    'property': id,
                    'triples': Utils.getJsonLdFirst(r[Void.TRIPLES], "@value"),
                    'distinctSubjects': Utils.getJsonLdFirst(r[Void.DISTINCT_SUBJECTS], ['@value']),
                    'distinctObjects': Utils.getJsonLdFirst(r[Void.DISTINCT_OBJECTS], ['@value'])
                }
            });
        const actionColWidth = "50";
        const numberColWidth = "80";
        const columns = [];
        columns.push(<TableHeaderColumn
            key="select"
            dataField="property"
            dataFormat={(cell,row) =>
            {return <ExcludeButton
                entityIri={cell}
                excludedEntities={excludedEntities}
                onExcludeEntities={this.props.onExcludeEntities}/>}}
            width={actionColWidth}>
        </TableHeaderColumn>)
        columns.push(<TableHeaderColumn key="property" dataField="property" isKey={true} dataSort={true}
                                        filter={ { type: 'TextFilter' } }
                                        dataFormat={(cell,row) =>
                                        {return <IncludedExcludedResource
                                            entityIri={cell}
                                            label={Utils.getShortForm(this.state.namespaces, cell)}
                                            excluded={excludedEntities.includes(cell)}></IncludedExcludedResource> }}>property</TableHeaderColumn>)
        columns.push(<TableHeaderColumn key="triples" dataField="triples" dataSort={true}
                                        width={numberColWidth}>triples</TableHeaderColumn>)
        columns.push(<TableHeaderColumn key="distinctSubjects" dataField="distinctSubjects" dataSort={true}
                                        width={numberColWidth}>dist.sbj</TableHeaderColumn>)
        columns.push(<TableHeaderColumn key="distinctObjects" dataField="distinctObjects" dataSort={true}
                                        width={numberColWidth}>dist.obj</TableHeaderColumn>)
        return (<Table data={data} columns={columns} sortName="triples"/>);
    };
}
