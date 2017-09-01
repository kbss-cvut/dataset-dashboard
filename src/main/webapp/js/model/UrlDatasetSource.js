import DatasetSource from './DatasetSource';

class UrlDatasetSource extends DatasetSource {
    constructor(url) {
        super();
        this._url = url;
    }

    get url() {
        return this._url;
    }

    get type() {
        return "http://onto.fel.cvut.cz/ontologies/dataset-descriptor/url-dataset-source"
    }
}

export default UrlDatasetSource ;