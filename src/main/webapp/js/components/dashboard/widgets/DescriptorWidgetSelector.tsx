'use strict';

import * as React from "react";
import {Dropdown, MenuItem} from "react-bootstrap";

interface Props {
    descriptors: {id : string}[],
    selectedDescriptor: {id : string},
    handleChangeDescriptor: (key) => void
}

export const DescriptorWidgetSelector: React.SFC<Props> = (props) => {
    const createLabel = (descriptor) => {
        return (descriptor && descriptor.id) ? descriptor.id.substring(54) : "-";
    }

    const descriptors = []
    props.descriptors.forEach((d) => {
        const name = createLabel(d)
        descriptors.push(<MenuItem eventKey={d.id} key={d.id}
                                   onSelect={(key) => props.handleChangeDescriptor(key)}>{name}</MenuItem>);
    });

    const name = createLabel(props.selectedDescriptor);
    return (<Dropdown
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
