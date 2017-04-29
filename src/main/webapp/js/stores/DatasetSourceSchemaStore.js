'use strict';

const Reflux = require('reflux');

const Actions = require('../actions/Actions');
const Ajax = require('../utils/Ajax');
const Logger = require('../utils/Logger');

const BASE_URL = 'rest/dataset-source';

const DatasetSourceSchemaStore = Reflux.createStore({

    listenables: [Actions],

    selectDatasetSource: null,
    datasetSchema: null,
    
    
    onSelectDatasetSource: function (selectDatasetSource) {
        this.selectDatasetSource = selectDatasetSource;
        this.datasetSchema = _fetchSchemaData();
        this.trigger({
            causeAction : Actions.selectDatasetSource,
            datasetSource : this.selectDatasetSource,
            datasetSchema : this.datasetSchema
        });
    }

});

function _fetchSchemaData(selectedDataSource){
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


module.exports = DatasetSourceSchemaStore;


