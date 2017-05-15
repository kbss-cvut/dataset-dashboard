'use strict';

import React from "react";
import Resource from "./Resource"

class ConceptScheme extends Resource {

    constructor(iri, labelMap) {
        super(iri, labelMap);
    }

    static loadFromJsonLd(jsonLd) {
        const iri = jsonLd['@id'];
        const label = Resource.getLiteral('http://www.w3.org/2000/01/rdf-schema#label', jsonLd);

        return new ConceptScheme( iri, {"en" : label});
    }
}

export default ConceptScheme;