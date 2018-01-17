'use strict';

import React from "react";
import {ControlLabel, FormControl, FormGroup} from "react-bootstrap";
import NamespaceStore from "../../../../stores/NamespaceStore";

class SelectGeoSparqlFeature extends React.Component {
    render() {
        let selectOptions = [];
        this.props.options.forEach((item) => {
            selectOptions.push(
                <option key={item["@id"]} value={item["@id"]}>
                    {NamespaceStore.getShortForm(item["@id"])}({item["http://own.schema.org/haveNumberOfInstances"][0]["@value"]})
                </option>
            )
        });

        return <FormGroup controlId="formControlsSelect">
            <ControlLabel>SelectZAX</ControlLabel>
            <FormControl componentClass="select"
                         placeholder="Select type"
                         onChange={this.props.onChange}>
                <option value="select">Select type</option>
                {selectOptions}
            </FormControl>
        </FormGroup>;
    }
}
export default SelectGeoSparqlFeature;
