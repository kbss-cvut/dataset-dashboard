import DatasetSource from './DatasetSource';
import Ddo from '../vocabulary/Ddo';

export default class UrlDatasetSource extends DatasetSource {
    constructor(url) {
        super();
        this._url = url;
    }

    get url() {
        return this._url;
    }

    get type() {
        return Ddo.UrlDatasetSource;
    }
}