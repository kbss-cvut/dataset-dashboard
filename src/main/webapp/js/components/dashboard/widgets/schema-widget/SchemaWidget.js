'use strict';

import * as React from "react";
import Reflux from "reflux";
import Graph from "react-graph-vis";
import {Modal,Checkbox} from "react-bootstrap";
import Slider from "react-rangeslider";
import GraphDefaults from "./vis/GraphDefaults";
import SchemaUtils from "./SchemaUtils";

import NamespaceStore from "../../../../stores/NamespaceStore";

import Utils from "../../../../utils/Utils";
import Rdf from "../../../../vocabulary/Rdf";
import Ddo from "../../../../vocabulary/Ddo";

export default class SchemaWidget extends Reflux.Component {

    constructor(props) {
        super(props);
        this.state = {
            namespaces: {},
            /**
             * Whether to show attributes in nodes
             */
            showAttributes: false,
            /**
             * Whether to show weight of edges
             */
            showWeight: true,
            /**
             * Minimal weight - edges below this weight will be discarded from the graph
             */
            minWeight: 100,
            /**
             * State for dataset sources dialog
             */
            show:false,
            /**
             * Node selected
             */
            selectedNode: null,
        };
        this.store=NamespaceStore;
    };

    // creates a new edge from srcNode to tgtNode using label prp.
    // fromToCount counts number of parallel edges srcNode to tgtNode and is
    // used to compute roundness of these edges
    createEdge(srcNode, tgtNode, prp, fromToCount, weight) {
        const edge = JSON.parse(JSON.stringify(GraphDefaults.edgeTemplate()));
        edge.from = srcNode.id;
        edge.to = tgtNode.id;
        edge.label = Utils.getShortForm(this.state.namespaces,prp);
        if (this.state.showWeight) {
            edge.width = SchemaUtils.getWidth(weight);
            edge.title = "" + weight;
            edge.label += " (" + weight + ")";
        }
        let count = fromToCount[SchemaUtils.getEdgeId(srcNode.id,tgtNode.id)];
        if (!count) count = 0;
        edge.smooth.roundness = SchemaUtils.getRoundnessForIthEdge(count, 4);
        fromToCount[SchemaUtils.getEdgeId(srcNode.id,tgtNode.id)] = count + 1;
        return edge;
    };

    setLabel(n,namespaces,showWeight) {
        n.label = '<b>'+Utils.getShortForm(namespaces,n.id)+'</b>' ;
        if (n.datasetSources.length > 0) {
            n.label += ' \n( in ';
            if (n.inDatasetClass) {
                n.label += ' current and '
            }

            n.label += n.datasetSources.length + ' other datasets )';
        }
        n.label += '\n';

        if ( n.dp ) {
            Object.keys(n.dp).forEach((dp) => {
                n.label += "\n"
                    + Utils.getShortForm(namespaces, n.dp[dp].prp)
                    + " ► "
                    + Utils.getShortForm(namespaces, n.dp[dp].tgt);
                if (showWeight) {
                    n.label += " (" + n.dp[dp].weight + ")";
                }
            });
        }

        return n;
    }

    _addDataProperty(node, prp, tgt, nodesWithEdge, weight) {
        if (this.state.showAttributes && weight >= this.state.minWeight) {
            if (!node.dp) {node.dp={}}
            if (!node.dp[prp+tgt]) {node.dp[prp+tgt] = {}}
            node.dp[prp+tgt].prp=prp;
            node.dp[prp+tgt].tgt=tgt;
            node.dp[prp+tgt].weight=weight;
            nodesWithEdge.push(node);
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
        const nodeMap = {};
        const edges = [];
        const fromToCount = {};
        const nodesWithEdge = [];

        results.forEach(function (b) {
            const from = b[Rdf.NS + 'subject'][0];
            const fromId = from['@id'];
            if (this.props.excludedEntities.includes(fromId)) {
                return;
            }

            const pred = b[Rdf.NS + 'predicate'][0];
            const predId = pred['@id'];
            if (this.props.excludedEntities.includes(predId)) {
                return;
            }

            const to = b[Rdf.NS + 'object'][0];
            const toId = to['@id'];
            if (this.props.excludedEntities.includes(toId)) {
                return;
            }

            const weight = parseInt(b[Ddo.NS + 's-p-o-summary/hasWeight'][0]['@value']);

            const parseDS = (s) => s[0]['@value'].split(",").filter((x) => x);

            const sDatasetSources = parseDS(b[Ddo.NS + 's-p-o-summary/hasSubjectDatasetSource']);
            const oDatasetSources = parseDS(b[Ddo.NS + 's-p-o-summary/hasObjectDatasetSource']);
            const fromNode = SchemaUtils.ensureNodeExists(nodeMap, fromId, newNode, sDatasetSources);
            if (SchemaUtils.isDataType(toId)) {
                this._addDataProperty(fromNode, predId, toId, nodesWithEdge, weight)
            } else {
                const tgtNode = SchemaUtils.ensureNodeExists(nodeMap, toId, newNode, oDatasetSources);
                this._addObjectProperty(fromNode, predId, tgtNode, nodesWithEdge,
                    weight, fromToCount, edges);
            }
        }.bind(this));
        nodesWithEdge.forEach((n) => { this.setLabel( n, this.state.namespaces, this.state.showWeight )});
        return {
            'nodes': Utils.unique(nodesWithEdge),
            'edges': edges,
            nodeMap : nodeMap
        };
    };

    render() {
        const maxLimitWeight = SchemaUtils.computeMaxEdgeWeight(this.props.descriptorContent)
        const graphOptions = GraphDefaults.graphOptions();
        const {nodes,edges,nodeMap} = this._constructGraphData(this.props.descriptorContent);
        const events = {
            select : (event) => {
                const {nodes, edges} = event;
                if (nodes.filter(n => n).length > 0)
                {
                    this.setState({show: true, selectedNode: nodeMap[nodes[0]]});
                }
            }
        };

        const b = []
        if ( this.state.selectedNode) {
            this.state.selectedNode.datasetSources.map(ds => {
                // TODO remove this nasty hack
                b.push(<li key={ds}><a href={'#/dashboard/online?endpointUrl='+ds}>{ds}</a></li>);
            });
        }

        return <div>
            <Modal show={this.state.show} onHide={() => this.setState({ show: false })}>
            <Modal.Header closeButton>
                <Modal.Title>Linked Datasets</Modal.Title>
            </Modal.Header>
                <Modal.Body><ul>{b}</ul></Modal.Body>
            </Modal>
            <Checkbox checked={this.state.showAttributes}
                      onChange={(e) => this.setState({showAttributes: e.target.checked}) }>
                Show attributes
            </Checkbox>
            <Checkbox checked={this.state.showWeight}
                      onChange={(e) => this.setState({showWeight: e.target.checked})}>
                Show weight
            </Checkbox>
            {this.state.showWeight ?
                <Slider
                    min={0}
                    max={maxLimitWeight}
                    value={this.state.minWeight}
                    onChange={(value) => this.setState({minWeight: value})}/>
                : <div/>}
            <Graph graph={{nodes:nodes, edges:edges}}
                   options={graphOptions}
                   events={events}
                   style={{width: '100%', height: '690px'}}/>
        </div>;
    };
}