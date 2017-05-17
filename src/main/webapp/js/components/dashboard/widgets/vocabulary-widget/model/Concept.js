'use strict';

import React from "react";
import Resource from "./Resource";

class Concept extends Resource {

    parentIri;

    constructor(iri, labelMap, parentIri) {
        super(iri,labelMap)
        this.parent = parent;
        this.parentIri = parentIri;
    }

    static loadFromJsonLd(jsonLd, subConceptOfRelation) {
        const iri = jsonLd['@id'];
        const label = Resource.getLiteral('http://www.w3.org/2000/01/rdf-schema#label', jsonLd);

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

export default Concept;