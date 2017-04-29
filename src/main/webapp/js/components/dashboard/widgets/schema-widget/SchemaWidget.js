'use strict';

import React from "react";
import Graph from "react-graph-vis";
import DatasetSourceSchemaStore from "../../../../stores/DatasetSourceSchemaStore";


class SchemaWidget extends React.Component {
    
    constructor(props) {
        super(props);
        console.log('SchemaWidget.constructor')
        console.log(this.setState)
        this.state = {
            datasetSource : null,
            datasetSchema : null
        };
    };
    
    componentWillMount() {
        console.log('componentWillMount')
        console.log(this.setState)
        this.unsubscribe = DatasetSourceSchemaStore.listen(this._onStoreChanged);
    };
    
    _onStoreChanged = (data) => {
        this.setState({
                datasetSource : data.datasetSource,
                datasetSchema : data.datasetSchema
            }
        );
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

export
default
SchemaWidget;
