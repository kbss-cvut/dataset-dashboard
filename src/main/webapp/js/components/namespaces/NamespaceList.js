'use strict';

import React from "react";
import NamespaceStore from "../../stores/NamespaceStore";

export default class NamespaceList extends React.Component {
    render() {
        const d = NamespaceStore.list();
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