'use strict';

import React from "react";

class DatasetSourceLabel extends React.Component {

    render() {
        const ds = this.props.datasetSource;
        let label="<Undefined>";
        if (ds) {
            if (ds.endpointUrl) {
                if (ds.graphId) {
                    label = <div>{ds.endpointUrl}<br/><div style={{fontSize : '75%'}}>&#10148; {ds.graphId}</div></div>
                } else {
                    label = <div>{ds.endpointUrl}</div>
                }
            } else {
                label = <div>{ds.downloadId}</div>
            }
        }

        return ( <div>{label}</div> );
    }
}

export default DatasetSourceLabel;
