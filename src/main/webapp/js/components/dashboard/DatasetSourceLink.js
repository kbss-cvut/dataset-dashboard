'use strict';

import React from "react";
import Actions from "../../actions/Actions";
import DatasetSourceLabel from "./DatasetSourceLabel";

class DatasetSourceLink extends React.Component {

    onClick() {
        Actions.selectDatasetSource(this.props.datasetSource);
    };

    render() {
        const ds = this.props.datasetSource;
        return ( ds.generated ? <div><DatasetSourceLabel datasetSource={ds}/></div> : <a href="#" onClick={(e) => this.onClick(e)}><DatasetSourceLabel datasetSource={ds}/></a> );
    }
}

export default DatasetSourceLink;
