'use strict';

import * as React from "react";
import * as Reflux from "reflux";
import NamespaceStore from "../../stores/NamespaceStore";

export default class NamespaceList extends Reflux.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.store = NamespaceStore;
    }

    render() {
        const d = this.state.namespaces;
        return (<BootstrapTable data={Object.keys(d).map((k) => {
            return {"namespace": k, "prefix": d[k]};
        })} striped={true} hover={true} condensed>
            <TableHeaderColumn dataField="prefix"
                               isKey={true}
                               dataSort={true}
                               filter={ {type: 'TextFilter', delay: 1000}}>prefix</TableHeaderColumn>
            <TableHeaderColumn dataField="namespace"
                               dataSort={true}
                               filter={ {type: 'TextFilter', delay: 1000}}>namespace</TableHeaderColumn>
        </BootstrapTable>)
    }
};