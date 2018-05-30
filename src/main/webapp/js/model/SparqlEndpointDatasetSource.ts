import UrlDatasetSource from './UrlDatasetSource';
import Ddo from '../vocabulary/Ddo';
import NamedGraphSparqlEndpointDatasetSource from "./NamedGraphSparqlEndpointDatasetSource";

export default class SparqlEndpointDatasetSource extends UrlDatasetSource {

    _endpointUrl : string;

    constructor(endpointUrl) {
        super(endpointUrl + "?query=CONSTRUCT WHERE {?s ?p ?o}")
        this._endpointUrl = endpointUrl;
    }

    addPart(ds : NamedGraphSparqlEndpointDatasetSource) : void {
        this.parts.push(ds);
    }

    get parts() : NamedGraphSparqlEndpointDatasetSource[] {
        return this._parts as NamedGraphSparqlEndpointDatasetSource[];
    }

    get endpointUrl() : string {
        return this._endpointUrl;
    }

    get type() {
        return Ddo.SparqlEndpointDatasetSource;
    }
}