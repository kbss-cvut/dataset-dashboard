'use strict';

import React from "react";

import LoadingWrapper from "../../../misc/LoadingWrapper";
import DescriptorWidgetWrapper from "../DescriptorWidgetWrapper";
import Ddo from "../../../../vocabulary/Ddo";


class TemporalWidget extends React.Component {

    constructor(props) {
        super(props);
    };

    computeMinMaxDates(results){
        if (results) {
            const b = results[0];
            const minD = b['http://onto.fel.cvut.cz/ontologies/lib/module/temporal-v1/hasMinDate'][0]['@value'];
            const maxD = b['http://onto.fel.cvut.cz/ontologies/lib/module/temporal-v1/hasMaxDate'][0]['@value'];
            return [minD,maxD];
        } else {
            return [0,0];
        }
    }

    render() {
        console.log("XXX"+this.props);
        let [min,max] = this.computeMinMaxDates(this.props.descriptorContent);

        return <div>
                    <p>
                        <span className="badge">Max Date: {max}</span>
                    </p>
                    <p>
                        <span className="badge">Min Date: {min}</span>
                    </p>
                </div>

    };
}

export default LoadingWrapper(DescriptorWidgetWrapper(TemporalWidget, Ddo.NS + "temporal-function", "temporal/getCoverage"),
    {maskClass: 'mask-container'});