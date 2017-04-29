'use strict';

import React from "react";

class DatasetSourceLabel extends React.Component {

    render() {
        const ds = this.props.datasetSource;
        let label="<Undefined>";
        if (ds) {
            if (ds.endpointUrl) {
                if (ds.graphId) {
                    label = <span>{ds.endpointUrl}<br/><span style={{fontSize : '75%'}}>&#10148; {ds.graphId}</span></span>
                } else {
                    label = <span>{ds.endpointUrl}</span>
                }
            } else {
                label = <span>{ds.downloadId}</span>
            }
        }

        return ( <span>{label}</span> );
    }
}

export default DatasetSourceLabel;
