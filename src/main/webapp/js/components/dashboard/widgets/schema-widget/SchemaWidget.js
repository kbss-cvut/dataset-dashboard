'use strict';

import React from "react";
import Graph from "react-graph-vis";
import {Modal,Checkbox} from "react-bootstrap";
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
            showAttributes: false,
            /**
             * Which classes to hide
             */
            hiddenClasses: [Ddo.NS+'weakly-described-resource'],
            /**
             * Whether to show weight of edges
             */
            showWeight: true,
            /**
             * Minimal weight - edges below this weight will be discarded from the graph
             */
            minWeight: 0,
            /**
             * State for dataset sources dialog
             */
            show:false,
            /**
             * Node selected
             */
            selectedNode: null,
            redirect : null
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

    // parse(results) {
    //     const edges=[];
    //     const nodeIri2DS=[];
    //     const ds2source=[];
    //     results.forEach( b => {
    //         // normal edge
    //         if ( b[Rdf.NS + 'subject'] ) {
    //             edges.push(b);
    //         }
    //         // dataset source specification
    //         else if (b[Rdf.NS + 's-p-o-summary/hasDatasetSource']) {
    //             const parseDS = (s) => s[0]['@value'];
    //             parseDS(b[Ddo.NS + 's-p-o-summary/hasDatasetSource']).forEach( ds => {
    //                 nodeIri2DS[b['@id']] = ds['@id']
    //             });
    //         }
    //         // dataset source definition
    //         else if (b[Rdf.NS + 's-p-o-summary/has-endpoint-url']) {
    //             if (b[Rdf.NS + 's-p-o-summary/has-graph-iri']) {
    //                 ds2source[b['@id']] = new NamedGraphSparqlEndpointDatasetSource(b[Rdf.NS + 's-p-o-summary/has-endpoint-url'],b[Rdf.NS + 's-p-o-summary/has-graph-iri'] );
    //             } else {
    //                 ds2source[b['@id']] = new SparqlEndpointDatasetSource(b[Rdf.NS + 's-p-o-summary/has-endpoint-url']);
    //             }
    //         }
    //     });
    //
    //     console.log(edges)
    //     console.log(nodeIri2DS)
    //     console.log(ds2source)
    //
    //     return {
    //         edges:edges,
    //         nodeIri2DS: nodeIri2DS,
    //         ds2source : ds2source
    //     }
    // }

    // transform data to be used with vis js
    _constructGraphData(results) {
        const newNode = () => JSON.parse(JSON.stringify(GraphDefaults.nodeTemplate()));
        const labelFn = (iri) => NamespaceStore.getShortForm(iri);
        const nodeMap = {};
        const edges = [];
        const fromToCount = {};
        const nodesWithEdge = [];

        // const x = this.parse(results);

        results.forEach(function (b) {
            const from = b[Rdf.NS + 'subject'][0];
            const fromId = from['@id'];
            const pred = b[Rdf.NS + 'predicate'][0];
            const predId = pred['@id'];
            const to = b[Rdf.NS + 'object'][0];
            const toId = to['@id'];

            const weight = parseInt(b[Ddo.NS + 's-p-o-summary/hasWeight'][0]['@value']);

            const parseDS = (s) => s[0]['@value'].split(",");

            const sDatasetSources = parseDS(b[Ddo.NS + 's-p-o-summary/hasSubjectDatasetSource']);
            const oDatasetSources = parseDS(b[Ddo.NS + 's-p-o-summary/hasObjectDatasetSource']);

            const fromNode = SchemaUtils.ensureNodeExists(nodeMap, fromId, newNode, labelFn, sDatasetSources);
            if (SchemaUtils.isDataType(toId)) {
                this._addDataProperty(fromNode, predId, toId, nodesWithEdge, weight)
            } else {
                const tgtNode = SchemaUtils.ensureNodeExists(nodeMap, toId, newNode, labelFn, oDatasetSources);
                this._addObjectProperty(fromNode, predId, tgtNode, nodesWithEdge,
                    weight, fromToCount, edges);
            }
        }.bind(this));
        return {
            'nodes': Utils.unique(nodesWithEdge.filter(n => (!this.props.excludedEntities.includes(n.id)))),
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
                const { nodes, edges } = event;
                this.setState({ show: true, selectedNode: nodeMap[nodes[0]] });
            }
        };

        const b = []
        if ( this.state.selectedNode) {
            this.state.selectedNode.datasetSources.map(ds => {
                // TODO remove this nasty hack
                b.push(<li key={ds}>
                    {/*<Button bsStyle="link" onClick={() => this.setState({redirect: ds})}>{ds}</Button>*/}
                    <a href={'#/dashboard/online?endpointUrl='+ds}>{ds}</a>
                </li>);
            });
        }

        // if (this.state.redirect) {
        //     return <Redirect to={this.state.redirect} />
        // }

        return <div>
            <Modal show={this.state.show} onHide={() => this.setState({ show: false })}>
            <Modal.Header closeButton>
                <Modal.Title>Modal title</Modal.Title>
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