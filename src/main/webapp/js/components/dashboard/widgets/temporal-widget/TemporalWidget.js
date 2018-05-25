'use strict';

import * as React from "react";

import Ddo from "../../../../vocabulary/Ddo";

class TemporalWidget extends React.Component {

    constructor(props) {
        super(props);
    };

    computeMinMaxDates(results){
        if (results && results[0]) {
            const b = results[0];
            const minD = b[Ddo.NS+'temporal-v1/hasMinDate'][0]['@value'];
            const maxD = b[Ddo.NS+'temporal-v1/hasMaxDate'][0]['@value'];
            return {min: minD, max: maxD };
        } else {
            return null;
        }
    }

    render() {
        let range = this.computeMinMaxDates(this.props.descriptorContent);

        return <div>
                    <p> {(range) ?
                        <span><span className="badge">From {range.min}</span>
                        <span className="badge">To {range.max}</span></span>
                        : <span>No temporal information available</span>}
                    </p>
                </div>
    };
}

export default TemporalWidget;