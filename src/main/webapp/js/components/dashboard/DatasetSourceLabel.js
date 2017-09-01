'use strict';

import React from "react";
import NamespaceStore from "../../stores/NamespaceStore";

class DatasetSourceLabel extends React.Component {

    render() {
        const ds = this.props.datasetSource;
        let label="<Undefined>";
        if (ds) {
            if (ds.endpointUrl) {
                if (ds.graphId) {
                    label = <span>{NamespaceStore.getShortForm(ds.graphId)}<span style={{fontSize : '75%'}}>&#10148; {NamespaceStore.getShortForm(ds.endpointUrl)}</span></span>
                } else {
                    label = <span>{NamespaceStore.getShortForm(ds.endpointUrl)}</span>
                }
            } else {
                label = <span>{NamespaceStore.getShortForm(ds.url)}</span>
            }
        }

        return ( <span>{label}</span> );
    }
}

export default DatasetSourceLabel;
