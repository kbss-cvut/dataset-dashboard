'use strict';

import React from "react";

class DatasetSourceLabel extends React.Component {

    render() {
        const ds = this.props.datasetSource;
        let label="<Undefined>";
        if (ds) {
            if (ds.endpointUrl) {
                if (ds.graphId) {
                    label = <span>{ds.graphId}<span style={{fontSize : '75%'}}>&#10148; {ds.endpointUrl}</span></span>
                } else {
                    label = <span>{ds.endpointUrl}</span>
                }
            } else {
                label = <span>{ds.url}</span>
            }
        }

        return ( <span>{label}</span> );
    }
}

export default DatasetSourceLabel;
