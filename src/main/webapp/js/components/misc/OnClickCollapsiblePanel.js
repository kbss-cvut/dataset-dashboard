'use strict';

import * as React from "react";
import {Panel, Button} from "react-bootstrap";

export default class OnClickCollapsiblePanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
    };

    render() {
        let title = <div>
            <Button onClick={ () => this.setState({open: !this.state.open})}>
                {this.props.title}
            </Button>
        </div>
        return (
            <Panel header={title} collapsible expanded={this.state.open}>
                {this.props.component}
            </Panel>
        );
    }
}
