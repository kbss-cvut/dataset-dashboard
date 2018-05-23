'use strict';

import React from "react";
import Reflux from "reflux";
import {TableHeaderColumn} from "react-bootstrap-table";

import NamespaceStore from "../../../../stores/NamespaceStore";
import Void from "../../../../vocabulary/Void";
import Utils from "../../../../utils/Utils";
import Table from "./Table";
import RenderUtils from "./RenderUtils";

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
                    'select': excludedEntities.includes(id),
                    'property': id,
                    'triples': Utils.getJsonLdFirst(r[Void.TRIPLES], "@value"),
                    'distinctSubjects': Utils.getJsonLdFirst(r[Void.DISTINCT_SUBJECTS], ['@value']),
                    'distinctObjects': Utils.getJsonLdFirst(r[Void.DISTINCT_OBJECTS], ['@value'])
                }
            });
        const actionColWidth = "50";
        const numberColWidth = "80";
        const columns = [];
        columns.push(<TableHeaderColumn key="select" dataField="select"
                                        dataFormat={(cell, row) => RenderUtils.formatSelect(cell, row.property, excludedEntities, (e) => this.props.onExcludeEntities(e))}
                                        width={actionColWidth}></TableHeaderColumn>)
        columns.push(<TableHeaderColumn key="property" dataField="property" isKey={true} dataSort={true}
                                        filter={ { type: 'TextFilter' } }
                                        dataFormat={(cell, row) => RenderUtils.format(this.state.namespaces,cell, row.select)}>property</TableHeaderColumn>)
        columns.push(<TableHeaderColumn key="triples" dataField="triples" dataSort={true}
                                        width={numberColWidth}>triples</TableHeaderColumn>)
        columns.push(<TableHeaderColumn key="distinctSubjects" dataField="distinctSubjects" dataSort={true}
                                        width={numberColWidth}>dist.sbj</TableHeaderColumn>)
        columns.push(<TableHeaderColumn key="distinctObjects" dataField="distinctObjects" dataSort={true}
                                        width={numberColWidth}>dist.obj</TableHeaderColumn>)
        return (<Table data={data} columns={columns} sortName="triples"/>);
    };
}
