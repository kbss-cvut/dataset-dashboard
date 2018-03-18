'use strict';

import React from "react";
import {Dropdown, MenuItem} from "react-bootstrap";

export default class DescriptorWidgetSelector extends React.Component {
    render() {
        const descriptors = []
        this.props.descriptors.forEach((d) => {
            const name = d.id.substring(54)
            descriptors.push(<MenuItem eventKey={d.id} key={d.id}  onSelect={(key) => this.props.handleChangeDescriptor(key)}>{name}</MenuItem>);
        });

        const name = this.props.descriptor ? this.props.descriptor.substring(54) : "-";
        return ( <Dropdown
            id="drpDescriptors"
            role="menuitem"
            placeholder="No descriptor selected"
           >
            <Dropdown.Toggle bsSize="small">{name}</Dropdown.Toggle>
            <Dropdown.Menu>
            {descriptors}
            </Dropdown.Menu>
        </Dropdown>)
    }
}
