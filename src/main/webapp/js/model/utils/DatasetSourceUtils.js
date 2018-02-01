'use strict';

import Ddo from '../../vocabulary/Ddo';
import DatasetSource from '../DatasetSource';
import NamedGraphSparqlEndpointDatasetSource from '../NamedGraphSparqlEndpointDatasetSource';
import SparqlEndpointDatasetSource from '../SparqlEndpointDatasetSource';

module.exports = {
    toQueryString: function (ds) {
        if (!ds) {
            return null;
        }

        if (ds.type === Ddo.SparqlEndpointDatasetSource) {
            return { endpointUrl : ds.endpointUrl }
        } else if (ds.type === Ddo.NamedGraphSparqlEndpointDatasetSource) {
            return { endpointUrl : ds.endpointUrl, graphIri: ds.graphId }
        } else if (ds.type === Ddo.UrlDatasetSource) {
            return { url : ds.url }
        } else {
            return null;
        }
    },

    create(ds) {
        let datasetSource;
        if (ds.type === Ddo.NamedGraphSparqlEndpointDatasetSource) {
            datasetSource = new NamedGraphSparqlEndpointDatasetSource(ds.endpointUrl, ds.graphId);
        } else if (ds.type === Ddo.SparqlEndpointDatasetSource) {
            datasetSource = new SparqlEndpointDatasetSource(ds.endpointUrl);
        } else if (ds.type === Ddo.UrlDatasetSource) {
            datasetSource = new UrlDatasetSource(ds.downloadUrl);
        }

        if (datasetSource) {
            datasetSource.id = ds.id;
            return datasetSource
        } else {
            throw new Error("Unknown dataset source type - " + ds.type);
        }
    }
};
