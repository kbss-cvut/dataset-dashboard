import DatasetSource from './DatasetSource';
import Ddo from '../vocabulary/Ddo';

export default class UrlDatasetSource extends DatasetSource {

    _url: string;

    constructor(url) {
        super();
        this._url = url;
    }

    get url() : string {
        return this._url;
    }

    get type() {
        return Ddo.UrlDatasetSource;
    }
}