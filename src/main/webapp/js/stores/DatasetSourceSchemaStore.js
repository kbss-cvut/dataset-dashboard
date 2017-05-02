'use strict';

const Reflux = require('reflux');

const Actions = require('../actions/Actions');
const Ajax = require('../utils/Ajax');
const Logger = require('../utils/Logger');

const BASE_URL = 'rest/dataset-source';

const DatasetSourceSchemaStore = Reflux.createStore({

    listenables: [Actions],

    selectDatasetSource: null,
    
    getSelectDatasetSource: function (){
        return this.selectDatasetSource;
    },
    
    onSelectDatasetSource: function (selectDatasetSource) {
        this.selectDatasetSource = selectDatasetSource;
        var datasetSourceId = selectDatasetSource.hash;
        Ajax.get(BASE_URL+"/"+datasetSourceId+"/spo-summary").end(function (data) {
            this.trigger({
                action: Actions.selectDatasetSource,
                datasetSchema: data
            });
        }.bind(this), function () {
            Logger.error('Unable to fetch spo for the given dataset.');
            this.trigger({
                action: Actions.selectDatasetSource,
                datasetSchema: null
            });
        }.bind(this));
    }

});



module.exports = DatasetSourceSchemaStore;


