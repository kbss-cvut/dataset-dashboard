'use strict';

const Reflux = require('reflux');

const Actions = require('../actions/Actions');
const Ajax = require('../utils/Ajax');
const Logger = require('../utils/Logger');

const BASE_URL = 'rest/dataset-source';

const DatasetSourceStore = Reflux.createStore({

    listenables: [Actions],

    selectDatasetSource: null,

    onSelectDatasetSource: function (selectDatasetSource) {
        this._selectDatasetSource = selectDatasetSource;
        this.trigger({
            action: Actions.selectDatasetSource,
            datasetSource: selectDatasetSource
        });
    },

    onRegisterDatasetSourceEndpoint: function (endpointUrl) {
        Ajax.put(BASE_URL+"/registerEndpoint?endpointUrl="+endpointUrl).end(function (data) {
            this.trigger({
                action: Actions.registerDatasetSourceEndpoint,
                endpointUrl: data,
                datasetSourceId: data
            });
        }.bind(this), function () {
            Logger.error('Unable to register endpoint.');
            this.trigger({
                action: Actions.registerDatasetSourceEndpoint,
                endpointUrl: endpointUrl,
                datasetSourceId: null
            });
        }.bind(this));
    },

    onRegisterDatasetSourceNamedGraph: function (endpointUrl, graphIri) {
        Ajax.put(BASE_URL+"/registerNamedGraph?endpointUrl="+endpointUrl+"&graphIri="+graphIri).end(function (data) {
            this.trigger({
                action: Actions.registerDatasetSourceNamedGraph,
                endpointUrl: endpointUrl,
                graphIri: graphIri,
                datasetSourceId: data
            });
        }.bind(this), function () {
            Logger.error('Unable to register endpoint.');
            this.trigger({
                action: Actions.registerDatasetSourceNamedGraph,
                endpointUrl: endpointUrl,
                graphIri: graphIri,
                datasetSourceId: null
            });
        }.bind(this));
    },

    onRegisterDatasetSourceDownloadUrl: function (downloadUrl) {
        Ajax.put(BASE_URL+"/registerUrl?downloadUrl="+downloadUrl).end(function (data) {
            this.trigger({
                action: Actions.registerDatasetUrl,
                downloadUrl: downloadUrl,
                datasetSourceId: data
            });
        }.bind(this), function () {
            Logger.error('Unable to register endpoint.');
            this.trigger({
                action: Actions.registerDatasetUrl,
                downloadUrl: downloadUrl,
                datasetSourceId: null
            });
        }.bind(this));
    },

    onGetAllDatasetSources: function () {
        Ajax.get(BASE_URL+"/all").end(function (data) {
            this.trigger({
                action: Actions.getAllDatasetSources,
                datasetSources: data,
            });
        }.bind(this), function () {
            Logger.error('Unable to get data.');
            this.trigger({
                action: Actions.getAllDatasetSources,
                datasetSources: null
            });
        }.bind(this));
    },

    onExecuteQueryForDatasetSource: function (datasetSourceId, queryName) {
        Ajax.get(BASE_URL+"/"+datasetSourceId+"/executeQuery?queryFile="+queryName).end(function (data) {
            this.trigger({
                action: Actions.executeQueryForDatasetSource,
                queryName: queryName,
                datasetSourceId: datasetSourceId,
                jsonLD: data
            });
        }.bind(this), function () {
            Logger.error('Unable to execute query.');
            this.trigger({
                action: Actions.executeQueryForDatasetSource,
                queryName: queryName,
                datasetSourceId: datasetSourceId,
                jsonLD: []
            });
        }.bind(this));
    }

});

module.exports = DatasetSourceStore;