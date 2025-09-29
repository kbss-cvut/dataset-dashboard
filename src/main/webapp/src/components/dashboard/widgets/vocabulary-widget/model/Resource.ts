'use strict';

export default class Resource {

    iri;
    labelMap;

    constructor(iri:string, labelMap: any) {
        this.iri = iri;
        this.labelMap = labelMap;
    }
}
