'use strict';

import React from "react";
import Graph from "react-graph-vis";
import Actions from "../../../../actions/Actions";
import Logger from "../../../../utils/Logger";
import DatasetSourceStore from "../../../../stores/DatasetSourceStore";
import NamespaceStore from "../../../../stores/NamespaceStore";
import LoadingWrapper from "../../../misc/LoadingWrapper";

class SchemaWidget extends React.Component {
    
    constructor(props) {
        super(props);
        Logger.log('SchemaWidget.constructor')
        this.state = {
            datasetSource : null,
            datasetSchema : null,
            namespaces: {}
        };
    };

    componentWillMount() {
        Logger.log('componentWillMount')
        this.unsubscribe = DatasetSourceStore.listen(this._onDataLoaded.bind(this));
    };

    componentWillUnmount() {
        this.unsubscribe();
    };

    _onDataLoaded = (data) => {
        const descriptorTypeId = "http://onto.fel.cvut.cz/ontologies/dataset-descriptor/s-p-o-summary-descriptor";

        if (data.action === Actions.selectDatasetSource) {
            this.setState({loadedQueries: []})
            this.props.loadingOn();
            Actions.getDescriptorForLastSnapshotOfDatasetSource(data.datasetSource.hash, descriptorTypeId);
        } else {
            if (data.descriptorTypeId == descriptorTypeId ) {
                this.props.loadingOff();
                this.setState({
                        datasetSource: DatasetSourceStore.getSelectedDatasetSource(),
                        datasetSchema: _constructGraphData(data.jsonLD)
                    }
                );
            }
        }
    };

    render(){
        if(!this.state.datasetSource){
            return <div style={{ textAlign: "center", verticalAlign:"center"}}>No Graph Available. Select an Event Type.</div>;
        }else{
            var options = {
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

            var events = {
                select: function(event) {
                    var { nodes, edges } = event;
                },
            }

            return <div><Graph graph={this.state.datasetSchema} options={options} events={events} style={{ width : '100%', height:'400px'}}/></div>;
        }
    };
}

// transform data to be used with vis js
function _constructGraphData(results){

    var dataTypeUris = [];
    var nodeUris = [];
    var nodeMap = {};
    var nodes = [];
    var edges = [];


    // check whether the uri is a datatype
    var isDataType = function (uri){
        return uri.startsWith('http://www.w3.org/2001/XMLSchema#') || uri.startsWith('http://www.w3.org/1999/02/22-rdf-syntax-ns#langString');
    };

    // calculate an id based on the uri
    var getNodeId = function(uri){
//        return mycrypto.createHash('md5').update(uri, 'UTF-8', 'UTF-8').digest().toString('base64');
        return uri;
    };

    // get the node for the uri, or create a new one if the node does not exist yet
    var ensureNodeCreated = function(uri){
            var nodeId = getNodeId(uri);
            var n = nodeMap[nodeId];
            if(!n){ // the node is not created yet
                    n = {'id': nodeId, 'size': 150, 'label': NamespaceStore.getShortForm(uri)+'\n', 'color': "#FFCFCF", 'shape': 'box', 'font': {'face': 'monospace', 'align': 'left'}},
                    nodes.push(n);
                    nodeMap[nodeId] = n;
            }
            return n;
    };
    let fromToCount={};
    // transform triples to vsijs nodes and edges
    results.forEach(function (b){
        let sourceNode = ensureNodeCreated(b['@id']);
        Object.keys(b).forEach((po) => {
            if ( po == '@id' ) {
                return;
            }
            if(isDataType(b[po][0]['@id'])){
                // do nothing for now
                //var targetNode = ensureNodeCreated(b.o.value);
                sourceNode['label'] = sourceNode['label'] + "\n" + NamespaceStore.getShortForm(po) + " ► " + NamespaceStore.getShortForm(b[po][0]['@id']);
            }else{
                // create the two nodes and the
                var targetNode = ensureNodeCreated(b[po][0]['@id']);

                let x = fromToCount[sourceNode.id+targetNode.id];
                if (!x) {x = 0};
                const max = 10;
                let y = ( ( x == 0 ) ? x :( ( x % max ) * ( ( x % 2 ) - 0.5 ) / max ) );
                var edge =  {
                    from: sourceNode.id,
                    to: targetNode.id,
                    label: NamespaceStore.getShortForm(po),
                    font: {align: 'middle'},
                    arrows: 'to',
                    physics: false,
                    smooth: {
                        'type': 'curvedCW',
                        'roundness': y
                    }
                };
                fromToCount[sourceNode.id+targetNode.id] = x+1;
                edges.push(edge);
            }
        });

    });
    return {'nodes' : nodes, 'edges': edges};
}


function _fetchMockSchemaData(selectedDataSource){
    return {
            nodes: [
                {id: 1, label: 'Node 1\nasdf', shape:'database'},
                {id: 2, label: 'Node 2', shape:'database'},
                {id: 3, label: 'Node 3', shape:'database'},
                {id: 4, label: 'Node 4\nasdf', shape:'circleEndpoint'},
                {id: 5, label: 'Node 5\nttt', shape:'box', style:'align:left;'}
              ],
            edges: [
                {from: 1, to: 2},
                {from: 1, to: 3},
                {from: 2, to: 4},
                {from: 2, to: 5}
              ]
          };
}



export default  LoadingWrapper(SchemaWidget, {maskClass: 'mask-container'});
