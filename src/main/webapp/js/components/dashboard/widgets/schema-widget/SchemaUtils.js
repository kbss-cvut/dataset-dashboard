'use strict';

import Rdf from "../../../../vocabulary/Rdf";
import Ddo from "../../../../vocabulary/Ddo";

export default class SchemaUtils {
    /**
     * Checks whether the given URI denotes an RDF datatype, i.e. an instance of rdfs:Datatype
     *
     * @param uri to be checked
     * @returns boolean
     */
    static isDataType(uri) {
        return uri.startsWith('http://www.w3.org/2001/XMLSchema#')
            || uri.startsWith(Rdf.NS + 'langString');
    };

    /**
     * Given an SPO summary, this method returns the maximal weight of edge weights withing the summary
     *
     * @param data SPO summary JSON-LD
     * @returns number
     */
    static computeMaxEdgeWeight(data) {
        let max = 0;
        if (data) {
            data.forEach((edge) => {
                const weight = edge[Ddo.NS + 's-p-o-summary/hasWeight'][0]['@value'];
                if (weight > max) {
                    max = weight;
                }
            });
        }
        return max;
    };
}