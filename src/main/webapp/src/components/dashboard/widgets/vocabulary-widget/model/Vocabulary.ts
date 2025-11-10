'use strict';

import Resource from "./Resource"
import Rdfs from "../../../../../vocabulary/Rdfs";
import Utils from "../../../../../utils/Utils";

export default class Vocabulary extends Resource {

    constructor(iri: string, labelMap: any) {
        super(iri, labelMap);
    }

    static loadFromJsonLd(jsonLd: any) {
        const iri = jsonLd['@id'];
        const label = Utils.getJsonLdPropertySingleLiteralValue(Rdfs.label, jsonLd);

        return new Vocabulary( iri, {"en" : label});
    }
}
