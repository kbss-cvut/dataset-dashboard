'use strict';

import React from "react";
import NamespaceStore from "../stores/NamespaceStore";
import {Panel, Button} from "react-bootstrap";

class NamespaceList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
    };

    render() {
        const d = NamespaceStore.list()
        let data = Object.keys(d).map((k) => {
            return { "namespace" : k, "prefix" : d[k]};
        });
        let title = <div>
            <Button onClick={ () => this.setState({open: !this.state.open})}>
                Namespaces
            </Button>
        </div>
        return (
            <Panel header={title} collapsible expanded={this.state.open}>
                <BootstrapTable data={data} striped={true} hover={true} condensed>
                    <TableHeaderColumn dataField="prefix" isKey={true} dataSort={true} filter={ { type: 'TextFilter', delay: 1000 }}>prefix</TableHeaderColumn>
                    <TableHeaderColumn dataField="namespace" dataSort={true} filter={ { type: 'TextFilter', delay: 1000 }}>namespace</TableHeaderColumn>
                </BootstrapTable>
            </Panel>
        );
    }
}
export default NamespaceList;
