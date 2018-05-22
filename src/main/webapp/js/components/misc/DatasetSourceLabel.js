'use strict';

import React from "react";
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
        const cmp = (title) => this.props.onClick ? <a href="#" onClick={(e) => this.onClick(e)}>{title}</a> : title;
        if (ds) {
            if (ds.type === Ddo.SparqlEndpointDatasetSource) {
                const title = this.s(ds.endpointUrl);
                const comp = cmp(title);
                label = <span data-tip={ds.id}>{comp} <a href={ds.id}>&#x2197;</a></span>
            } else if (ds.type === Ddo.NamedGraphSparqlEndpointDatasetSource) {
                label = <span data-tip={ds.id}>{this.s(ds.graphId)}<span
                    style={{fontSize: '75%'}}>&#10148; {this.s(ds.endpointUrl)}<a href={ds.id}>&#x2197;</a></span></span>
            } else if (ds.type === Ddo.UrlDatasetSource) {
                label = <span data-tip={ds.id}>{this.s(ds.url)}<a href={ds.id}>&#x2197;</a></span>
            } else {
                label = <span data-tip={ds.id}>{ds.id + " (unknown type)"}<a href={ds.id}>&#x2197;</a></span>
            }
        } else {
            label = <span>No Dataset Source Selected</span>;
        }

        return ( label );
    }
}
