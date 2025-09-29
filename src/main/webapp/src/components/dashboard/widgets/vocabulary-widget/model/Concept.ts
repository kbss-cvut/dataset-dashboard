'use strict';

import Resource from "./Resource";
import Rdfs from "../../../../../vocabulary/Rdfs";
import Utils from "../../../../../utils/Utils";

export default class Concept extends Resource {

    parentIri;

    constructor(iri: string, labelMap: any, parentIri: string | null) {
        super(iri,labelMap)
        this.parentIri = parentIri;
    }

    static loadFromJsonLd(jsonLd: any, subConceptOfRelation: any) {
        const iri: string = jsonLd['@id'];
        const label: string = Utils.getJsonLdPropertySingleLiteralValue(Rdfs.label, jsonLd);

        const superConcepts = jsonLd[subConceptOfRelation];
        let parentIri = null;
        if (superConcepts) {
            if ( superConcepts.length == 1 ) {
                parentIri = superConcepts[0]['@id'];
            }
        }
        return new Concept( iri, {"en" : label}, parentIri);
    }
}
