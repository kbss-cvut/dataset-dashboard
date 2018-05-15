'use strict';

import Rdf from "../../../../vocabulary/Rdf";
import Ddo from "../../../../vocabulary/Ddo";

export default class SchemaUtils {

    // i - index of the edge
    // max - number of edges
    static getRoundnessForIthEdge(i, max) {
        return ( ( i == 0 ) ? 0 : ( ( i % max ) * 1.5 * ( ( i % 2 ) - 0.5 ) / max ) )
    };

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
                const weight = parseInt(edge[Ddo.NS + 's-p-o-summary/hasWeight'][0]['@value']);
                if (weight > max) {
                    max = weight;
                }
            });
        }
        return max;
    };

    /**
     * Returns an identifier of an unordered pair of graph nodes. It is used for counting the roundness of the edges.
     *
     * @param srcNode
     * @param tgtNode
     * @returns {*}
     */
    static getEdgeId(srcNode,tgtNode) {
        if (srcNode < tgtNode ) {
            return srcNode+tgtNode;
        } else {
            return tgtNode+srcNode;
        }
    }

    /**
     * Creates a new node with given uri or reuses an existing if present in nodeMap.
     *
     * @param nodeMap
     * @param nodeIri
     * @returns {*}
     */
    static ensureNodeExists(nodeMap, nodeIri, newNode, label, datasetSources) {
        let n = nodeMap[nodeIri];
        if (!n) { // the node is not created yet
            n = newNode();
            n.id = nodeIri;
            n.label = '<b>'+label(nodeIri)+'</b>' ;
            n.datasetSources = datasetSources.filter(ds => ds).map( ds => {
                // if (ds.contains('graphIri')) {
                //     // TODO nasty hack, should be passed from the server
                // }
                if (ds.endsWith("dataset/snapshot")) {
                    ds = ds.substring(0,ds.length-16);
                }

                return ds;
            });
            if (n.datasetSources.length > 0) {
                n.label = n.label + ' \n( in ' + n.datasetSources.length + ' other datasets )';
            }
            n.label = n.label + '\n';
            nodeMap[nodeIri] = n;
        }
        return n;
    };

    /**
     * Generates an edge with for the real width
     */
    static getWidth(weight) {
        return Math.round(Math.log(weight) / Math.log(5));
    };
}