'use strict';

import Resource from "./Resource";
import Rdfs from "../../../../../vocabulary/Rdfs";
import Utils from "../../../../../utils/Utils";

export default class Concept extends Resource {

    parent;
    parentIri;

    constructor(iri, labelMap, parentIri) {
        super(iri,labelMap)
        this.parent = parent;
        this.parentIri = parentIri;
    }

    static loadFromJsonLd(jsonLd, subConceptOfRelation) {
        const iri = jsonLd['@id'];
        const label = Utils.getJsonLdPropertySingleLiteralValue(Rdfs.label, jsonLd);

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
