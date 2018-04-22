'use strict';

import React from "react";
import Graph from "react-graph-vis";
import {Checkbox} from "react-bootstrap";
import Slider from "react-rangeslider";
import GraphDefaults from "./vis/GraphDefaults";
import SchemaUtils from "./SchemaUtils";

import NamespaceStore from "../../../../stores/NamespaceStore";

import Utils from "../../Utils";
import Rdf from "../../../../vocabulary/Rdf";
import Ddo from "../../../../vocabulary/Ddo";

export default class SchemaWidget extends React.Component {

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
        };
    };

    // creates a new node with given uri or reuses an existing if present in nodeMap.
    ensureNodeCreated(nodeMap, uri) {
        let nodeId = uri;
        let n = nodeMap[nodeId];
        if (!n) { // the node is not created yet
            n = JSON.parse(JSON.stringify(GraphDefaults.nodeTemplate()));
            n.id = nodeId;
            n.label = NamespaceStore.getShortForm(uri) + '\n';
            nodeMap[nodeId] = n;
        }
        return n;
    };

    // creates a new edge from srcNode to tgtNode using label prp.
    // fromToCount counts number of parallel edges srcNode to tgtNode and is
    // used to compute roundness of these edges
    ensureEdgeCreated(edgeMap, srcNode, tgtNode, prp, fromToCount, weight) {
        let edge = edgeMap[srcNode.id + prp + tgtNode.id];
        if (!edge) {
            edge = JSON.parse(JSON.stringify(GraphDefaults.edgeTemplate()));
            edge.from = srcNode.id;
            edge.to = tgtNode.id;
            edge.label = NamespaceStore.getShortForm(prp);
            if (this.state.showWeight) {
                edge.width = Math.round(Math.log(weight) / Math.log(5));
                edge.title = "" + weight;
                edge.label = edge.label + " (" + weight + ")";
            }
            let count = fromToCount[srcNode.id + tgtNode.id];
            if (!count) count = 0;
            edge.smooth.roundness = SchemaUtils.getRoundnessForIthEdge(count, 8);
            fromToCount[srcNode.id + tgtNode.id] = count + 1;
            edgeMap[srcNode.id + prp + tgtNode.id] = edge;
        }
        return edge;
    };

    updateLabel(node, prp, tgt, weight ) {
        node['label'] += "\n"
            + NamespaceStore.getShortForm(prp)
            + " ► "
            + NamespaceStore.getShortForm(tgt);
        if (this.state.showWeight) {
            node['label'] += " (" + weight + ")";
        }
    }

    // transform data to be used with vis js
    _constructGraphData(results) {
        const nodeMap = {};
        const edgeMap = {};
        const attrMap = {};
        const edges = [];
        const fromToCount = {};
        // transform triples to visjs nodes and edges
        const nodesWithEdge = [];
        results.forEach(function (b) {
            const srcNode = this.ensureNodeCreated(nodeMap, b[Rdf.NS + 'subject'][0]['@id']);
            const prp = b[Rdf.NS + 'predicate'][0]['@id'];
            const tgt = b[Rdf.NS + 'object'][0]['@id'];
            const weight = parseInt(b[Ddo.NS + 's-p-o-summary/hasWeight'][0]['@value']);
            if (SchemaUtils.isDataType(tgt)) {
                const shouldAdd = this.state.showAttributes && !attrMap[srcNode.id + prp + tgt];
                attrMap[srcNode.id + prp + tgt] = true;
                if (shouldAdd && weight >= this.state.minWeight) {
                    this.updateLabel(srcNode,prp, tgt, weight);
                    nodesWithEdge.push(srcNode);
                }
            } else {
                const tgtNode = this.ensureNodeCreated(nodeMap, tgt);
                const shouldAdd = !edgeMap[srcNode.id + prp + tgtNode.id];
                const edge = this.ensureEdgeCreated(edgeMap, srcNode, tgtNode, prp, fromToCount, weight);
                if (shouldAdd && weight >= this.state.minWeight) {
                    edges.push(edge);
                    nodesWithEdge.push(srcNode);
                    nodesWithEdge.push(tgtNode);
                }
            }
        }.bind(this));
        return {'nodes': Utils.unique(nodesWithEdge), 'edges': edges};
    };

    render() {
        const maxLimitWeight = SchemaUtils.computeMaxEdgeWeight(this.props.descriptorContent)
        const graphOptions = GraphDefaults.graphOptions();
        graphOptions.configure.enabled = true;

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
                    onChange={(value) => {
                        this.setState({minWeight: value});
                    }}/>
                : <div/>}
            <Graph graph={this._constructGraphData(this.props.descriptorContent)}
                   options={graphOptions}
                   style={{width: '100%', height: '690px'}}/>
        </div>;
    };
}