'use strict';

export default class Ddo {

    static get NS() {
        return 'http://onto.fel.cvut.cz/ontologies/dataset-descriptor/';
    }

    static get NamedGraphSparqlEndpointDatasetSource() {
        return this.NS + "named-graph-sparql-endpoint-dataset-source";
    }

    static get SparqlEndpointDatasetSource() {
        return this.NS + "sparql-endpoint-dataset-source";
    }

    static get UrlDatasetSource() {
        return this.NS + "url-dataset-source";
    }
}

