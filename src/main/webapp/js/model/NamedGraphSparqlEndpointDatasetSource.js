import UrlDatasetSource from './UrlDatasetSource';
import Ddo from '../vocabulary/Ddo';

export default class NamedGraphSparqlEndpointDatasetSource extends UrlDatasetSource {
    constructor(endpointUrl, graphId) {
        super(endpointUrl+"?query=CONSTRUCT ?s ?p ?o WHERE {<"+graphId+"> {?s ?p ?o}}")
        this._endpointUrl = endpointUrl;
        this._graphId = graphId;
    }

    get endpointUrl() {
        return this._endpointUrl;
    }

    get graphId() {
        return this._graphId;
    }

    get type() {
        return Ddo.NamedGraphSparqlEndpointDatasetSource;
    }
}