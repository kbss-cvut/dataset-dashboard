'use strict';

import React from "react";
import Reflux from "reflux";
import {ControlLabel, FormControl, FormGroup} from "react-bootstrap";
import NamespaceStore from "../../../../stores/NamespaceStore";
import Utils from "../../../../utils/Utils";

class SelectGeoSparqlFeature extends Reflux.Component {

    constructor(props) {
        super(props);
        this.store=NamespaceStore;
    };

    componentDidMount() {
        const max=10000000000000000000000000000000000000;
        let minNumberInstances = max;
        let minId=null;
        this.props.options.forEach((item) => {
            const num = item["http://own.schema.org/haveNumberOfInstances"][0]["@value"];
            const id = item["@id"];
            if ( (minNumberInstances > num && num > 2) || minNumberInstances == max) {
                minNumberInstances = num;
                minId = id;
            }
        });
        this.props.onChange(minId)
    }

    render() {
        let selectOptions = [];
        this.props.options.forEach((item) => {
            const num = item["http://own.schema.org/haveNumberOfInstances"][0]["@value"];
            const id = item["@id"];
            selectOptions.push(
                <option key={id} value={id}>
                    {Utils.getShortForm(this.state.namespaces,id)}({num})
                </option>
            )
        });

        return <FormGroup controlId="formControlsSelect">
            <ControlLabel>Select Type</ControlLabel>
            <FormControl componentClass="select"
                         placeholder="Select Type"
                         onChange={(event) => this.props.onChange(event.target.value)}
                         value={this.props.value}>
                <option value="select">No type selected</option>
                {selectOptions}
            </FormControl>
        </FormGroup>;
    }
}
export default SelectGeoSparqlFeature;
