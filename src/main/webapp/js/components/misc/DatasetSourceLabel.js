'use strict';

import React from "react";
import NamespaceStore from "../../stores/NamespaceStore";
import Ddo from "../../vocabulary/Ddo"
import ReactTooltip from 'react-tooltip'

export default class DatasetSourceLabel extends React.Component {
    render() {
        const ds = this.props.datasetSource;
        let label;
        if (ds) {
            if (ds.type === Ddo.SparqlEndpointDatasetSource) {
                label = <span data-tip={ds.id}>{NamespaceStore.getShortForm(ds.endpointUrl)}</span>
            } else if (ds.type === Ddo.NamedGraphSparqlEndpointDatasetSource) {
                label = <span data-tip={ds.id}>{NamespaceStore.getShortForm(ds.graphId)}<span
                    style={{fontSize: '75%'}}>&#10148; {NamespaceStore.getShortForm(ds.endpointUrl)}</span></span>
            } else if (ds.type === Ddo.UrlDatasetSource) {
                label = <span data-tip={ds.id}>{NamespaceStore.getShortForm(ds.url)}</span>
            } else {
                label = <span data-tip={ds.id}>{ds.id + " (unknown type)"}</span>
            }
        } else {
            label = <span>No Dataset Source Selected</span>;
        }

        return ( <span><span>{label}</span><ReactTooltip /></span> );
    }
}
