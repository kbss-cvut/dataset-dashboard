'use strict';

import React from "react";
import NamespaceStore from "../../stores/NamespaceStore";
import Ddo from "../../vocabulary/Ddo"

export default class DatasetSourceLabel extends React.Component {
    render() {
        const ds = this.props.datasetSource;
        let label;
        if (ds) {
            if (ds.type === Ddo.SparqlEndpointDatasetSource) {
                label = <span>{NamespaceStore.getShortForm(ds.endpointUrl)}</span>
            } else if (ds.type === Ddo.NamedGraphSparqlEndpointDatasetSource) {
                label = <span>{NamespaceStore.getShortForm(ds.graphId)}<span
                    style={{fontSize: '75%'}}>&#10148; {NamespaceStore.getShortForm(ds.endpointUrl)}</span></span>
            } else if (ds.type === Ddo.UrlDatasetSource) {
                label = <span>{NamespaceStore.getShortForm(ds.url)}</span>
            } else {
                label = <span>{ds + "Unknown type"}</span>
            }
        } else {
            label = <span>No Dataset Source Selected</span>;
        }

        return ( <span>{label}</span> );
    }
}
