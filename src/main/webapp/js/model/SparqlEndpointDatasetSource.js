import UrlDatasetSource from './UrlDatasetSource';
import Ddo from '../vocabulary/Ddo';

export default class SparqlEndpointDatasetSource extends UrlDatasetSource {
    constructor(endpointUrl) {
        super(endpointUrl + "?query=CONSTRUCT WHERE {?s ?p ?o}")
        this._endpointUrl = endpointUrl;
    }

    get endpointUrl() {
        return this._endpointUrl;
    }

    get type() {
        return Ddo.SparqlEndpointDatasetSource;
    }
}