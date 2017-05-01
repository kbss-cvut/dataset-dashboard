'use strict';

import React from "react";
import Graph from "react-graph-vis";
import DatasetSourceSchemaStore from "../../../../stores/DatasetSourceSchemaStore";
import Logger from "../../../../utils/Logger";

class SchemaWidget extends React.Component {
    
    constructor(props) {
        super(props);
        Logger.log('SchemaWidget.constructor')
        Logger.log(this.setState)
        this.state = {
            datasetSource : null,
            datasetSchema : null
        };
    };
    
    componentWillMount() {
        Logger.log('componentWillMount')
        Logger.log(this.setState)
        this.unsubscribe = DatasetSourceSchemaStore.listen(this._onStoreChanged);
    };
    
    _onStoreChanged = (data) => {
        if(data.datasetSchema){
            this.setState({
                    datasetSource : DatasetSourceSchemaStore.getSelectDatasetSource(),
                    datasetSchema : _constructGraphData(data.datasetSchema)
                }
            );
        }
    };

    render(){
        if(!this.state.datasetSource){
            return <div style={{ textAlign: "center", verticalAlign:"center"}}>No Graph Available. Select an Event Type.</div>;
        }else{
            var options = {
                layout: {
                    hierarchical: true
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

            return <div>Schema Diagram for {this.state.datasetSource.graphId}<br/><Graph graph={this.state.datasetSchema} options={options} events={events} style={{ width : '100%', height:'600px'}}/></div>;
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
                    n = {'id': nodeId, 'size': 150, 'label': uri, 'color': "#FFCFCF", 'shape': 'box', 'font': {'face': 'monospace', 'align': 'left'}},
                    nodes.push(n);
                    nodeMap[nodeId] = n;
            }
            return n;
    };

    // transform triples to vsijs nodes and edges
    results.results.bindings.forEach(function (b){
        if(isDataType(b.o.value)){
            // do nothing for now
            var sourceNode = ensureNodeCreated(b.s.value);
            //var targetNode = ensureNodeCreated(b.o.value);
            sourceNode['label'] = sourceNode['label'] + "\n" + b.p.value + " : " + b.o.value;
        }else{
            // create the two nodes and the 
            var sourceNode = ensureNodeCreated(b.s.value);
            var targetNode = ensureNodeCreated(b.o.value);
            var edge =  {'from': sourceNode.id, 'to': targetNode.id, label: b.p.value, 'arrows': 'to', 'physics': false, 'smooth': {'type': 'cubicBezier'}};
            edges.push(edge);
        }

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



export default SchemaWidget;
