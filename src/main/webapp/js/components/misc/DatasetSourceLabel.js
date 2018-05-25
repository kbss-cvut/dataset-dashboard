'use strict';

import * as React from "react";
import Reflux from "reflux";

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
        const cmp = (title) => this.props.onClick ? <a href="#" onClick={(e) => this.props.onClick(e)}>{title}</a> : title;
        if (ds) {
            let title;
            if (ds.type === Ddo.SparqlEndpointDatasetSource) {
                title = this.s(ds.endpointUrl);
            } else if (ds.type === Ddo.NamedGraphSparqlEndpointDatasetSource) {
                title = <span><span>{this.s(ds.graphId)}</span><span
                    style={{fontSize: '75%'}}>&#10148;{this.s(ds.endpointUrl)}</span></span>;
            } else if (ds.type === Ddo.UrlDatasetSource) {
                title = this.s(ds.url);
            } else {
                title = ds.id + " (unknown type)";
            }
            label = <span data-tip={ds.id}>{cmp(title)} <a href={ds.id}>&#x2197;</a></span>
        } else {
            label = <span>No Dataset Source Selected</span>;
        }

        return ( label );
    }
}
