'use strict';

import React from "react";

class TemporalWidget extends React.Component {

    constructor(props) {
        super(props);
    };

    computeMinMaxDates(results){
        if (results) {
            const b = results[0];
            const minD = b['http://onto.fel.cvut.cz/ontologies/dataset-descriptor/temporal-v1/hasMinDate'][0]['@value'];
            const maxD = b['http://onto.fel.cvut.cz/ontologies/dataset-descriptor/temporal-v1/hasMaxDate'][0]['@value'];
            return [minD,maxD];
        } else {
            return [0,0];
        }
    }

    render() {
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

export default TemporalWidget;