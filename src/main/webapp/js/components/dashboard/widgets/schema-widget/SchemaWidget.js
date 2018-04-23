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
import Skos from "../../../../vocabulary/Skos";
import Owl from "../../../../vocabulary/Owl";

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
             * Which classes to hide
             */
            hiddenClasses: ["http://onto.fel.cvut.cz/ontologies/dataset-descriptor/weakly-described-resource"],
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

    // creates a new edge from srcNode to tgtNode using label prp.
    // fromToCount counts number of parallel edges srcNode to tgtNode and is
    // used to compute roundness of these edges
    createEdge(srcNode, tgtNode, prp, fromToCount, weight) {
        const edge = JSON.parse(JSON.stringify(GraphDefaults.edgeTemplate()));
        edge.from = srcNode.id;
        edge.to = tgtNode.id;
        edge.label = NamespaceStore.getShortForm(prp);
        if (this.state.showWeight) {
            edge.width = SchemaUtils.getWidth(weight);
            edge.title = "" + weight;
            edge.label = edge.label + " (" + weight + ")";
        }
        let count = fromToCount[SchemaUtils.getEdgeId(srcNode.id,tgtNode.id)];
        if (!count) count = 0;
        edge.smooth.roundness = SchemaUtils.getRoundnessForIthEdge(count, 4);
        fromToCount[SchemaUtils.getEdgeId(srcNode.id,tgtNode.id)] = count + 1;
        return edge;
    };

    _updateLabel(node, prp, tgt, weight) {
        node.label += "\n"
            + NamespaceStore.getShortForm(prp)
            + " ► "
            + NamespaceStore.getShortForm(tgt);
        if (this.state.showWeight) {
            node.label += " (" + weight + ")";
        }
    }

    _addDataProperty(srcNode, prp, tgt, nodesWithEdge, weight) {
        if (this.state.showAttributes && weight >= this.state.minWeight) {
            this._updateLabel(srcNode, prp, tgt, weight);
            nodesWithEdge.push(srcNode);
        }
    }

    _addObjectProperty(srcNode, prp, tgtNode, nodesWithEdge, weight, fromToCount, edges) {
        const edge = this.createEdge(srcNode, tgtNode, prp, fromToCount, weight);
        if (weight >= this.state.minWeight) {
            edges.push(edge);
            nodesWithEdge.push(srcNode);
            nodesWithEdge.push(tgtNode);
        }
    }

    // transform data to be used with vis js
    _constructGraphData(results) {
        const newNode = () => JSON.parse(JSON.stringify(GraphDefaults.nodeTemplate()));
        const label = (iri) => NamespaceStore.getShortForm(iri);
        const nodeMap = {};
        const tripleExists = {};
        const edges = [];
        const fromToCount = {};
        // transform triples to visjs nodes and edges
        const nodesWithEdge = [];
        results.forEach(function (b) {
            const from = b[Rdf.NS + 'subject'][0]['@id'];
            const prp = b[Rdf.NS + 'predicate'][0]['@id'];
            const to = b[Rdf.NS + 'object'][0]['@id'];
            if (tripleExists[from + prp + to]) {
                return;
            }
            tripleExists[from + prp + to] = true;
            const weight = parseInt(b[Ddo.NS + 's-p-o-summary/hasWeight'][0]['@value']);
            const fromNode = SchemaUtils.ensureNodeExists(nodeMap, from, newNode, label);
            if (SchemaUtils.isDataType(to)) {
                this._addDataProperty(fromNode, prp, to, nodesWithEdge, weight)
            } else {
                const tgtNode = SchemaUtils.ensureNodeExists(nodeMap, to, newNode, label);
                this._addObjectProperty(fromNode, prp, tgtNode, nodesWithEdge,
                    weight, fromToCount, edges);
            }
        }.bind(this));
        return {
            'nodes': Utils.unique(nodesWithEdge.filter(n => (!this.state.hiddenClasses.includes(n.id)))),
            'edges': edges
        };
    };

    _createCheckBox(lbl, hiddenClass) {
        return (
        <Checkbox key={"CHBHC_"+hiddenClass}
                  checked={!this.state.hiddenClasses.includes(hiddenClass)}
                  onChange={(e) => {
                      let hiddenClasses = this.state.hiddenClasses;
                      const index = hiddenClasses.indexOf(hiddenClass);
                      if ( index > -1 ) {
                          delete hiddenClasses[index];
                      } else {
                          hiddenClasses.push(hiddenClass);
                      }
                      this.setState({hiddenClasses: hiddenClasses});
                  }}>
            {lbl}
        </Checkbox> );
    }

    render() {
        const maxLimitWeight = SchemaUtils.computeMaxEdgeWeight(this.props.descriptorContent)
        const graphOptions = GraphDefaults.graphOptions();
        graphOptions.configure.enabled = true;
        const checkboxes=[];
        checkboxes.push(this._createCheckBox('Show owl:Thing',Owl.THING))
        checkboxes.push(this._createCheckBox('Show skos:Concept',Skos.CONCEPT));
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
            {checkboxes}
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