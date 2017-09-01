import UrlDatasetSource from './UrlDatasetSource';

class SparqlEndpointDatasetSource extends UrlDatasetSource {
    constructor(endpointUrl) {
        super(endpointUrl+"?query=CONSTRUCT WHERE {?s ?p ?o}")
        this._endpointUrl = endpointUrl;
    }

    get endpointUrl() {
        return this._endpointUrl;
    }

    get type() {
        return "http://onto.fel.cvut.cz/ontologies/dataset-descriptor/sparql-endpoint-dataset-source"
    }
}

export default SparqlEndpointDatasetSource ;