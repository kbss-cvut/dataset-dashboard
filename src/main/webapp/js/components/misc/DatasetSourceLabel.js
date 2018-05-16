'use strict';

import React from "react";
import Reflux from "reflux";

import ReactTooltip from 'react-tooltip'

import NamespaceStore from "../../stores/NamespaceStore";
import Ddo from "../../vocabulary/Ddo"
import Utils from "../../utils/Utils";

export default class DatasetSourceLabel extends Reflux.Component {

    constructor(props)
    {
        super(props);
        this.state = {};
        this.store = NamespaceStore;
    }

    s(iri) {
        return Utils.getShortForm(this.state.namespaces,iri)
    }

    render() {
        const ds = this.props.datasetSource;
        let label;
        if (ds) {
            if (ds.type === Ddo.SparqlEndpointDatasetSource) {
                label = <span data-tip={ds.id}>{this.s(ds.endpointUrl)}</span>
            } else if (ds.type === Ddo.NamedGraphSparqlEndpointDatasetSource) {
                label = <span data-tip={ds.id}>{this.s(ds.graphId)}<span
                    style={{fontSize: '75%'}}>&#10148; {this.s(ds.endpointUrl)}</span></span>
            } else if (ds.type === Ddo.UrlDatasetSource) {
                label = <span data-tip={ds.id}>{this.s(ds.url)}</span>
            } else {
                label = <span data-tip={ds.id}>{ds.id + " (unknown type)"}</span>
            }
        } else {
            label = <span>No Dataset Source Selected</span>;
        }

        return ( <span><span>{label}</span><ReactTooltip /></span> );
    }
}
