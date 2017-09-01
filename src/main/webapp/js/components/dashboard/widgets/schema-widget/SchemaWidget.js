'use strict';

import React from "react";
import Graph from "react-graph-vis";
import {Checkbox} from "react-bootstrap";
import Slider from "react-rangeslider";

import LoadingWrapper from "../../../misc/LoadingWrapper";
import NamespaceStore from "../../../../stores/NamespaceStore";

import Utils from "../../Utils";
import Rdf from "../../../../vocabulary/Rdf";

import DescriptorWidgetWrapper from "../DescriptorWidgetWrapper";

const DD_NS = "http://onto.fel.cvut.cz/ontologies/dataset-descriptor/";

const nodeTemplate = {
    size: 150,
    color: "#f3ffc2",
    shape: 'box',
    font: {
        face: 'monospace',
        align: 'left'
    }
};

const edgeTemplate = {
    font: {align: 'middle'},
    arrows: 'to',
    physics: false,
    smooth: {
        'type': 'curvedCW',
    }
};

const graphOptions = {
    layout: {
        hierarchical: {
            direction: 'LR',
            levelSeparation: 400,
            nodeSpacing: 100,
            treeSpacing: 200,
        }
    },
    edges: {
        color: "#000000"
    }
};


// i - index of the edge
// max - number of edges
function getRoundnessForIthEdge(i, max) {
    return ( ( i == 0 ) ? i : ( ( i % max ) * ( ( i % 2 ) - 0.5 ) / max ) )
};

function isDataType(uri) {
    return uri.startsWith('http://www.w3.org/2001/XMLSchema#')
        || uri.startsWith(Rdf.NS + 'langString');
};

class SchemaWidget extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            namespaces: {},
            /**
             * Whether to show attributes in nodes
             */
            showAttributes: true,
            /**
             * Whether to show weight of edges
             */
            showWeight: true,
            /**
             * Minimal weight - edges below this weight will be discarded from the graph
             */
            minWeight: 0,
            /**
             * Maximal Limit Weight - computed as a maximum of edge frequencies.
             */
            maxLimitWeight: 0,
        };
    };

    computeMax(data) {
        let max = 0;
        if ( data ) {
            data.forEach((edge) => {
                const weight = edge[DD_NS + 's-p-o-summary/hasWeight'][0]['@value'];
                if (weight > max) {
                    max = weight;
                }
            });
        }
        return max;
    };

    // creates a new node with given uri or reuses an existing if present in nodeMap.
    ensureNodeCreated(nodeMap, uri) {
        // let nodeId = mycrypto.createHash('md5').update(uri, 'UTF-8', 'UTF-8').digest().toString('base64');
        // get the node for the uri, or create a new one if the node does not exist yet
        let nodeId = uri;
        let n = nodeMap[nodeId];
        if (!n) { // the node is not created yet
            n = JSON.parse(JSON.stringify(nodeTemplate));
            n.id = nodeId;
            n.label = NamespaceStore.getShortForm(uri) + '\n';
            nodeMap[nodeId] = n;
        }
        return n;
    };

    // creates a new edge from srcNode to tgtNode using label prp.
    // fromToCount counts number of parallel edges srcNode to tgtNode and is
    // used to compute roundness of these edges
    createEdge(srcNode, tgtNode, prp, fromToCount, weight) {
        const edge = JSON.parse(JSON.stringify(edgeTemplate));
        edge.from = srcNode.id;
        edge.to = tgtNode.id;
        edge.label = NamespaceStore.getShortForm(prp);
        if (this.state.showWeight) {
            edge.width = Math.round(Math.log(weight) / Math.log(5));
            edge.title = weight;
        }
        let count = fromToCount[srcNode.id + tgtNode.id];
        if (!count) count = 0;
        edge.smooth.roundness = getRoundnessForIthEdge(count, 10);
        fromToCount[srcNode.id + tgtNode.id] = count + 1;
        return edge;
    };

    // transform data to be used with vis js
    _constructGraphData(results) {
        const nodeMap = {};
        const edges = [];
        const fromToCount = {};
        // transform triples to visjs nodes and edges
        const nodesWithEdge = [];
        results.forEach(function (b) {
            const srcNode = this.ensureNodeCreated(nodeMap, b[Rdf.NS + 'subject'][0]['@id']);
            const prp = b[Rdf.NS + 'predicate'][0]['@id'];
            const tgt = b[Rdf.NS + 'object'][0]['@id'];
            const weight = b[DD_NS + 's-p-o-summary/hasWeight'][0]['@value'];
            if (isDataType(tgt)) {
                if (this.state.showAttributes) {
                    if (weight >= this.state.minWeight) {
                        srcNode['label'] += "\n"
                            + NamespaceStore.getShortForm(prp)
                            + " ► "
                            + NamespaceStore.getShortForm(tgt);
                        if (this.state.showWeight) {
                            srcNode['label'] += " (" + weight + ")";
                        }
                        nodesWithEdge.push(srcNode);
                    }
                }
            } else {
                const tgtNode = this.ensureNodeCreated(nodeMap, tgt);
                const edge = this.createEdge(srcNode, tgtNode, prp, fromToCount, weight);
                if (weight >= this.state.minWeight) {
                    edges.push(edge);
                    nodesWithEdge.push(srcNode);
                    nodesWithEdge.push(tgtNode);
                }
            }
        }.bind(this));
        return {'nodes': Utils.unique(nodesWithEdge), 'edges': edges};
    };

    handleChange(value) {
        this.setState({minWeight: value})
    }

    render() {
        const maxLimitWeight = this.computeMax(this.props.descriptorContent)
        return <div>
            <Checkbox checked={this.state.showAttributes}
                      onChange={(e) => {
                          this.setState({showAttributes: e.target.checked});
                      }}>
                Show attributes
            </Checkbox>
            <Checkbox checked={this.state.showWeight}
                      onChange={(e) => {
                          this.setState({showWeight: e.target.checked});
                      }}>
                Show weight
            </Checkbox>
            {this.state.showWeight ?
                <Slider
                    min={0}
                    max={maxLimitWeight}
                    value={this.state.minWeight}
                    onChange={(value) => this.handleChange(value)}
                />
                : <div/>}
            <Graph graph={this._constructGraphData(this.props.descriptorContent)}
                   options={graphOptions}
                   style={{width: '100%', height: '400px'}}/>
        </div>;
    };
}
export default LoadingWrapper(DescriptorWidgetWrapper(SchemaWidget, DD_NS + "spo-summary-descriptor", "spo/spo-summary"),
    {maskClass: 'mask-container'});