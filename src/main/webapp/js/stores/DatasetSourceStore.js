'use strict';

import Reflux from 'reflux';
import jsonld from 'jsonld';
import Actions from '../actions/Actions';
import Ajax from '../utils/Ajax';
import Logger from '../utils/Logger';

const datasetSourcesAdHoc = require('../../resources/dataset-sources/ad-hoc.json');

const BASE_URL = 'rest/dataset-source';

const DatasetSourceStore = Reflux.createStore({

    listenables: [Actions],

    selectDatasetSource: null,

    init() {
      this.addFromResource(datasetSourcesAdHoc);
    },

    addFromResource(data) {
        for (var key in data) {
            if ( data[key]['endpointUrl'] ) {
                if ( data[key]['graphId'] ) {
                    this.onRegisterDatasetSourceNamedGraph([data[key]['endpointUrl']],[data[key]['graphId']]);
                } else {
                    this.onRegisterDatasetSourceEndpoint([data[key]['endpointUrl']]);
                }
            }
        }
    },

    getSelectedDatasetSource: function() {
        return this.selectDatasetSource;
    },

    onSelectDatasetSource: function (selectDatasetSource) {
        this.selectDatasetSource = selectDatasetSource;
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
            const that = this;
            jsonld.flatten(data, function(err, canonical) {
                that.trigger({
                    action: Actions.executeQueryForDatasetSource,
                    queryName: queryName,
                    datasetSourceId: datasetSourceId,
                    jsonLD: canonical
                });
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
    },

    onGetDescriptorForLastSnapshotOfDatasetSource: function (datasetSourceId, descriptorTypeId) {
        Ajax.get(BASE_URL+"/"+datasetSourceId+"/lastDescriptor?descriptorType="+descriptorTypeId).end(function (data) {
            const that = this;
            jsonld.flatten(data, function(err, canonical) {
                that.trigger({
                    action: Actions.getDescriptorForLastSnapshotOfDatasetSource,
                    descriptorTypeId: descriptorTypeId,
                    datasetSourceId: datasetSourceId,
                    jsonLD: canonical
                });
            });
        }.bind(this), function () {
            Logger.error('Unable to fetch last descriptor of type '+ descriptorTypeId+' for the dataset source id ' + datasetSourceId);
            this.trigger({
                action: Actions.getDescriptorForLastSnapshotOfDatasetSource,
                descriptorTypeId: descriptorTypeId,
                datasetSourceId: datasetSourceId,
                jsonLD: []
            });
        }.bind(this));
    }
});

module.exports = DatasetSourceStore;