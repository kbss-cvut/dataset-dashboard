'use strict';

import React from "react";
import NamespaceStore from "../../../../../stores/NamespaceStore";


class Resource {

    iri;

    labelMap;

    constructor(iri, labelMap) {
        this.iri = iri;
        this.labelMap = labelMap;
    }

    static getLiteral( property, jsonLd ) {
        let label = jsonLd[property];
        if (label) {
            if (label.length > 0) {
                label = label[0];
            }
            if (label["@language"]) {
                label = label["@value"] + ' (' + label["@language"] + ')';
            } else if (label["@value"]) {
                label = label["@value"];
            } else if (label["@id"]) {
                label = NamespaceStore.getShortForm(label["@id"]);
            }
        }
        return label;
    }
}

export default Resource;