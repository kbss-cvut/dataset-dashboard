'use strict';

import * as React from "react";
import {Dropdown, MenuItem} from "react-bootstrap";

export default class DescriptorWidgetSelector extends React.Component {

    createLabel(descriptor) {
        return ( descriptor && descriptor.id ) ? descriptor.id.substring(54) : "-";
    }

    render() {
        const descriptors = []
        this.props.descriptors.forEach((d) => {
            const name = this.createLabel(d)
            descriptors.push(<MenuItem eventKey={d.id} key={d.id}  onSelect={(key) => this.props.handleChangeDescriptor(key)}>{name}</MenuItem>);
        });

        const name = this.createLabel( this.props.selectedDescriptor );
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
