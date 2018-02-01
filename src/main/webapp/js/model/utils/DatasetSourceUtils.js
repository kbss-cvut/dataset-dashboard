'use strict';

import Ddo from '../../vocabulary/Ddo';

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
};
