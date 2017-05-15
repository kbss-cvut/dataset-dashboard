'use strict';

import React from "react";
import Resource from "./Resource";
import ConceptScheme from "./ConceptScheme";

const skosPrefix = "http://www.w3.org/2004/02/skos/core#";

class Concept extends Resource {

    childrenIris;

    conceptSchemeIri;

    constructor(iri, labelMap, childrenIris, conceptSchemeIri) {
        super(iri,labelMap)
        this.parent = parent;
        this.conceptSchemeIri = conceptSchemeIri;
        this.childrenIris = childrenIris;
    }

    static loadFromJsonLd(jsonLd) {
        const iri = jsonLd['@id'];
        const label = Resource.getLiteral('http://www.w3.org/2000/01/rdf-schema#label', jsonLd);
        const conceptSchemeIris = jsonLd[skosPrefix + "inScheme"];
        let conceptSchemeIri = null;
        if (conceptSchemeIris) {
            conceptSchemeIri = conceptSchemeIris[0]['@id'];
        }
        // let conceptScheme = null;
        // if (conceptSchemeIri) {
        //     conceptScheme = ConceptScheme.loadFromJsonLd(conceptSchemeIri)
        // }
        const childrenIris = [];

        const narrowers = jsonLd[skosPrefix + "narrower"];
        if (narrowers) {
            narrowers.forEach((narrower) => {
                childrenIris.push(narrower['@id']);
            })
        }
        return new Concept( iri, {"en" : label}, childrenIris, conceptSchemeIri);
    }
}

export default Concept;