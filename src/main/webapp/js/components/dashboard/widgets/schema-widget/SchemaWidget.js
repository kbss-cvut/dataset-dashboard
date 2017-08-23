'use strict';

import React from "react";
import Graph from "react-graph-vis";
import Actions from "../../../../actions/Actions";
import DatasetSourceStore from "../../../../stores/DatasetSourceStore";
import NamespaceStore from "../../../../stores/NamespaceStore";
import LoadingWrapper from "../../../misc/LoadingWrapper";
import {Checkbox} from "react-bootstrap";

const nodeTemplate = {
    size: 150,
    color: "#FFCFCF",
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


class SchemaWidget extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            datasetSource: null,
            datasetSchema: null,
            namespaces: {},
            showAttributes: true
        };
    };

    componentWillMount() {
        this.unsubscribe = DatasetSourceStore.listen(this._onDataLoaded.bind(this));
    };

    componentWillUnmount() {
        this.unsubscribe();
    };

    _onDataLoaded = (data) => {
        const descriptorTypeId = "http://onto.fel.cvut.cz/ontologies/dataset-descriptor/spo-summary-descriptor";

        if (data.action === Actions.selectDatasetSource) {
            this.setState({loadedQueries: []})
            this.props.loadingOn();
            Actions.getDescriptorForLastSnapshotOfDatasetSource(data.datasetSource.hash, descriptorTypeId);
        } else {
            if (data.descriptorTypeId == descriptorTypeId) {
                this.props.loadingOff();
                this.setState({
                        datasetSource: DatasetSourceStore.getSelectedDatasetSource(),
                        datasetSchema: data.jsonLD
                    }
                );
            }
        }
    };

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

    createEdge(srcNode, tgtNode, prp, fromToCount) {
        const edge = JSON.parse(JSON.stringify(edgeTemplate));
        edge.from = srcNode.id;
        edge.to = tgtNode.id;
        edge.label = NamespaceStore.getShortForm(prp);
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
        results.forEach(function (b) {
            const srcNode = this.ensureNodeCreated(nodeMap, b['@id']);
            Object.keys(b).forEach((prp) => {
                if (prp == '@id') {
                    return;
                }
                const range = b[prp][0]['@id'];
                if (isDataType(range)) {
                    if (this.state.showAttributes) {
                        srcNode['label'] =
                            srcNode['label']
                            + "\n"
                            + NamespaceStore.getShortForm(prp)
                            + " ► "
                            + NamespaceStore.getShortForm(range);
                    }
                } else {
                    const tgtNode = this.ensureNodeCreated(nodeMap, range);
                    const edge = this.createEdge(srcNode, tgtNode, prp,fromToCount);
                    edges.push(edge);
                }
            });
        }.bind(this));
        return {'nodes': Object.values(nodeMap), 'edges': edges};
    };

    render() {
        if (!this.state.datasetSource) {
            return <div style={{textAlign: "center", verticalAlign: "center"}}>
                No Graph Available.
            </div>;
        } else {
            return <div>
                <Checkbox checked={this.state.showAttributes}
                          onChange={(e) => {this.setState({showAttributes: e.target.checked});}}>
                    Show attributes
                </Checkbox>
                <Graph graph={this._constructGraphData(this.state.datasetSchema)}
                       options={graphOptions}
                       style={{width: '100%', height: '400px'}}/>
            </div>;
        }
    };
}

// i - index of the edge
// max - number of edges
function getRoundnessForIthEdge(i, max) {
    return ( ( i == 0 ) ? i : ( ( i % max ) * ( ( i % 2 ) - 0.5 ) / max ) )
};

function isDataType(uri) {
    return uri.startsWith('http://www.w3.org/2001/XMLSchema#')
        || uri.startsWith('http://www.w3.org/1999/02/22-rdf-syntax-ns#langString');
};

export default  LoadingWrapper(SchemaWidget, {maskClass: 'mask-container'});
