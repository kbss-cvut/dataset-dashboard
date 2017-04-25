'use strict';

import React from "react";
import Actions from "../../actions/Actions";

class DatasetSourceRow extends React.Component {

    onClick() {
        Actions.selectDatasetSource(this.props.datasetSource);
    };

    render() {
        const ds = this.props.datasetSource;
        let label;
        if ( ds.endpointUrl ) {
            if (ds.graphId) {
                label = <div>{ds.endpointUrl}<br/>{ds.graphId}</div>
            } else {
                label = <div>{ds.endpointUrl}</div>
            }
        } else {
            label = <div>{ds.downloadId}</div>
        }

        return ( <tr><td>({ds.hash})</td>
            <td><a href="#" onClick={(e) => this.onClick(e)}>{label}</a></td>
        </tr> );
    }
}

export default DatasetSourceRow;
