'use strict';

export default class Resource {

    iri;
    labelMap;

    constructor(iri, labelMap) {
        this.iri = iri;
        this.labelMap = labelMap;
    }
}
