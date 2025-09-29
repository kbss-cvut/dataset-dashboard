'use strict';

import * as React from "react";
import Reflux from "reflux";
import {ControlLabel, FormControl, FormGroup} from "react-bootstrap";
import NamespaceStore from "../../../../stores/NamespaceStore";
import Utils from "../../../../utils/Utils";
import Ddo from "../../../../vocabulary/Ddo";

export default class SelectGeoSparqlFeature extends Reflux.Component {

    constructor(props) {
        super(props);
        this.store=NamespaceStore;
    };

    componentDidMount() {
        const max=Number.MAX_VALUE;
        let minNumberInstances = max;
        let minId=null;
        this.props.options.forEach((item) => {
            const num = item[Ddo.NS+"spatial/has-number-of-instances"][0]["@value"];
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
            const num = item[Ddo.NS+"spatial/has-number-of-instances"][0]["@value"];
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
