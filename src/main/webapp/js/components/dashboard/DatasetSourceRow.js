'use strict';

import React from "react";
import Actions from "../../actions/Actions";

class DatasetSourceRow extends React.Component {

    onClick() {
        Actions.selectDatasetSource(this.props.datasetSource);
    };

    render() {
        const ds = this.props.datasetSource;
        return ( <tr>
            <td><a href="#" onClick={(e) => this.onClick(e)}>{ds.hash} ({ds.id})</a></td>
        </tr> );
    }
}

export default DatasetSourceRow;
