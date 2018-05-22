'use strict';

import React from "react";
import Actions from "../../actions/Actions";
import DatasetSourceLabel from "./DatasetSourceLabel";

export default class DatasetSourceLink extends React.Component {

    onClick() {
        Actions.selectDatasetSource(this.props.datasetSource);
    };

    render() {
        const ds = this.props.datasetSource;
        return ( ds.generated ? <DatasetSourceLabel datasetSource={ds} onClick={(e) => this.onClick(e)}/> : <DatasetSourceLabel datasetSource={ds} onClick={(e) => this.onClick(e)}/>);
    }
}
