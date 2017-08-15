'use strict';

import Reflux from 'reflux';
import jsonld from 'jsonld';
import Actions from '../actions/Actions';
import Ajax from '../utils/Ajax';
import Logger from '../utils/Logger';
import Utils from '../utils/Utils';
import NamedGraphSparqlEndpointDatasetSource from '../model/NamedGraphSparqlEndpointDatasetSource';
import SparqlEndpointDatasetSource from '../model/SparqlEndpointDatasetSource';
import UrlDatasetSource from '../model/UrlDatasetSource';

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
        const ds = new SparqlEndpointDatasetSource(endpointUrl);
        Ajax.put(BASE_URL+"/registerEndpoint?endpointUrl="+endpointUrl).end(function (data) {
            ds.id = data;
            this.trigger({
                action: Actions.registerDatasetSourceEndpoint,
                datasetSource: ds
            });
        }.bind(this), function () {
            Logger.error('Unable to register endpoint.');
            this.trigger({
                action: Actions.registerDatasetSourceEndpoint,
                datasetSource: ds
            });
        }.bind(this));
    },

    onRegisterDatasetSourceNamedGraph: function (endpointUrl, graphIri) {
        const ds = new NamedGraphSparqlEndpointDatasetSource(endpointUrl, graphIri);
        Ajax.put(BASE_URL+"/registerNamedGraph?endpointUrl="+endpointUrl+"&graphIri="+graphIri).end(function (data) {
            ds.id = data;
            this.trigger({
                action: Actions.registerDatasetSourceNamedGraph,
                datasetSource: ds
            });
        }.bind(this), function () {
            Logger.error('Unable to register endpoint.');
            this.trigger({
                action: Actions.registerDatasetSourceNamedGraph,
                datasetSource: ds
            });
        }.bind(this));
    },

    onRegisterDatasetSourceDownloadUrl: function (downloadUrl) {
        const ds = new UrlDatasetSource(downloadUrl);
        Ajax.put(BASE_URL+"/registerUrl?downloadUrl="+downloadUrl).end(function (data) {
            ds.id = data;
            this.trigger({
                action: Actions.registerDatasetUrl,
                datasetSource: ds
            });
        }.bind(this), function () {
            Logger.error('Unable to register endpoint.');
            this.trigger({
                action: Actions.registerDatasetUrl,
                datasetSource: ds
            });
        }.bind(this));
    },

    _parseDatasetSource: function(ds) {
        var datasetSource = null;
        if ( ds.type === "http://onto.fel.cvut.cz/ontologies/dataset-descriptor/named-graph-sparql-endpoint-dataset-source") {
            datasetSource = new NamedGraphSparqlEndpointDatasetSource(ds.endpointUrl, ds.graphId);
        } else if ( ds.type === "http://onto.fel.cvut.cz/ontologies/dataset-descriptor/sparql-endpoint-dataset-source") {
            datasetSource = new SparqlEndpointDatasetSource(ds.endpointUrl);
        } else if ( ds.type === "http://onto.fel.cvut.cz/ontologies/dataset-descriptor/url-dataset-source") {
            datasetSource = new UrlDatasetSource(ds.downloadUrl);
        }

        if ( datasetSource != null ) {
            datasetSource.id = ds.id;
            datasetSource.hash = ds.hash;
        } else {
            throw new Error("Unknown dataset source type - " + ds.type);
        }
        return datasetSource;
    },

    onGetAllDatasetSources: function () {
        Ajax.get(BASE_URL+"/all").end(function (data) {
            this.trigger({
                action: Actions.getAllDatasetSources,
                datasetSources: data.map(this._parseDatasetSource),
            });
        }.bind(this), function () {
            Logger.error('Unable to get data.');
            this.trigger({
                action: Actions.getAllDatasetSources,
                datasetSources: null
            });
        }.bind(this));
    },

    onExecuteQueryForDatasetSource: function (datasetSourceId, queryName, params) {
        const url = Utils.addParametersToUrl(BASE_URL+"/"+datasetSourceId+"/executeQuery?queryFile="+queryName, params)
        Ajax.get(url).end(function (data) {
            const that = this;
            jsonld.flatten(data, function(err, canonical) {
                that.trigger({
                    action: Actions.executeQueryForDatasetSource,
                    queryName: queryName,
                    params: params,
                    datasetSourceId: datasetSourceId,
                    jsonLD: canonical
                });
            });
        }.bind(this), function () {
            Logger.error('Unable to execute query.');
            this.trigger({
                action: Actions.executeQueryForDatasetSource,
                queryName: queryName,
                params: params,
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