'use strict';

import React from "react";
import Resource from "./Resource"

export default class Vocabulary extends Resource {

    subVocabularies;

    constructor(iri, labelMap) {
        super(iri, labelMap);
    }

    static loadFromJsonLd(jsonLd) {
        const iri = jsonLd['@id'];
        const label = Resource.getLiteral('http://www.w3.org/2000/01/rdf-schema#label', jsonLd);

        return new Vocabulary( iri, {"en" : label});
    }
}
