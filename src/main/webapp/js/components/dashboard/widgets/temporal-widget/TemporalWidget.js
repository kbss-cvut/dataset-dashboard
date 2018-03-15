'use strict';

import React from "react";

import LoadingWrapper from "../../../misc/LoadingWrapper";
import DescriptorWidgetWrapper from "../DescriptorWidgetWrapper";
import Ddo from "../../../../vocabulary/Ddo";


class TemporalWidget extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            minDate : '',
            maxDate : ''

        };
    };

    computeMinMaxDates(results){
        results.forEach(function (b) {
            const minD = b['http://onto.fel.cvut.cz/ontologies/lib/module/temporal-v1/hasMinDate'][0]['@value'];
            const maxD = b['http://onto.fel.cvut.cz/ontologies/lib/module/temporal-v1/hasMaxDate'][0]['@value'];

            this.state.maxDate = maxD;
            this.state.minDate = minD;

        }.bind(this));

    }

    render() {
        console.log(this.props);
        this.computeMinMaxDates(this.props.descriptorContent);

        return <div>
                    <p>
                        <span className="badge">Max Date: {this.state.maxDate}</span>
                    </p>
                    <p>
                        <span className="badge">Min Date: {this.state.minDate}</span>
                    </p>
                </div>

    };
}

export default LoadingWrapper(DescriptorWidgetWrapper(TemporalWidget, Ddo.NS + "temporal-function", "temporal/getCoverage"),
    {maskClass: 'mask-container'});