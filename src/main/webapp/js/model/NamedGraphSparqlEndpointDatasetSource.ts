import UrlDatasetSource from './UrlDatasetSource';
import Ddo from '../vocabulary/Ddo';

export default class NamedGraphSparqlEndpointDatasetSource extends UrlDatasetSource {

    _endpointUrl : string;
    _graphId : string;

    constructor(endpointUrl, graphId) {
        super(endpointUrl+"?query=CONSTRUCT ?s ?p ?o WHERE {<"+graphId+"> {?s ?p ?o}}")
        this._endpointUrl = endpointUrl;
        this._graphId = graphId;
    }

    get endpointUrl() : string {
        return this._endpointUrl;
    }

    get graphId() : string  {
        return this._graphId;
    }

    get type() : string {
        return Ddo.NamedGraphSparqlEndpointDatasetSource;
    }
}