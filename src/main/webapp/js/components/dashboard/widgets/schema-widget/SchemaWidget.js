'use strict';

import React from "react";
import Graph from "react-graph-vis";
import { Checkbox} from "react-bootstrap";
import Slider from "react-rangeslider";
import GraphDefaults from "./vis/GraphDefaults";
import SchemaUtils from "./SchemaUtils";

import LoadingWrapper from "../../../misc/LoadingWrapper";
import NamespaceStore from "../../../../stores/NamespaceStore";

import Utils from "../../Utils";
import Rdf from "../../../../vocabulary/Rdf";

import DescriptorWidgetWrapper from "../DescriptorWidgetWrapper";
import Ddo from "../../../../vocabulary/Ddo";

// i - index of the edge
// max - number of edges
function getRoundnessForIthEdge(i, max) {
    return ( ( i == 0 ) ? i : ( ( i % max ) * ( ( i % 2 ) - 0.5 ) / max ) )
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
    createEdge(srcNode, tgtNode, prp, fromToCount, weight) {
        const edge = JSON.parse(JSON.stringify(GraphDefaults.edgeTemplate()));
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
        edge.smooth.roundness = getRoundnessForIthEdge(count, 8);
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
            const weight = b[Ddo.NS + 's-p-o-summary/hasWeight'][0]['@value'];
            if (SchemaUtils.isDataType(tgt)) {
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

    render() {
        const maxLimitWeight = SchemaUtils.computeMaxEdgeWeight(this.props.descriptorContent)
        const isFullScreen = this.props.isFullScreen ? this.props.isFullScreen : false;
        const graphOptions = GraphDefaults.graphOptions();
        graphOptions.configure.enabled = isFullScreen;

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
                   style={{width: '100%', height: isFullScreen ? '900px' : '600px'}}/>)
        </div>;
    };
}

export default LoadingWrapper(DescriptorWidgetWrapper(SchemaWidget, Ddo.NS + "spo-summary-descriptor", "spo/spo-summary"),
    {maskClass: 'mask-container'});