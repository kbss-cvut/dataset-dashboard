class DatasetSource {

    constructor(type) {
        this._id = null;
        this._parts = [];
    }

    addPart(ds) {
        this.parts.push(ds);
    }

    set id(id) {
        this._id = id;
    }

    get id() {
        return this._id;
    }

    get parts() {
        return this._parts;
    }

    get type() {
        throw new Error();
    }

    create(ds) {
        if ( ds.type === "http://onto.fel.cvut.cz/ontologies/dataset-descriptor/named-graph-sparql-endpoint-dataset-source") {
            return new NamedGraphSparqlEndpointDatasetSource(ds.endpointUrl, ds.graphId);
        } else if ( ds.type === "http://onto.fel.cvut.cz/ontologies/dataset-descriptor/sparql-endpoint-dataset-source") {
            return new SparqlEndpointDatasetSource(ds.endpointUrl);
        } else if ( ds.type === "http://onto.fel.cvut.cz/ontologies/dataset-descriptor/url-dataset-source") {
            return new UrlDatasetSource(ds.downloadUrl);
        } else {
            throw new Error();
        }
    }
}

export default DatasetSource ;