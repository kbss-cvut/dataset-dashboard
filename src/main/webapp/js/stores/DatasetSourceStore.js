'use strict';

import Reflux from "reflux";
import jsonld from "jsonld";
import Actions from "../actions/Actions";
import Ajax from "../utils/Ajax";
import Logger from "../utils/Logger";
import Utils from "../utils/Utils";
import NamedGraphSparqlEndpointDatasetSource from "../model/NamedGraphSparqlEndpointDatasetSource";
import SparqlEndpointDatasetSource from "../model/SparqlEndpointDatasetSource";
import UrlDatasetSource from "../model/UrlDatasetSource";
import Ddo from "../vocabulary/Ddo";

const datasetSourcesAdHoc = require('../../resources/dataset-sources/ad-hoc.json');

const DatasetSourceStore = Reflux.createStore({

    base: 'rest/dataset-source',

    listenables: [Actions],

    selectDatasetSource: null,

    init() {
        this.addFromResource(datasetSourcesAdHoc);
    },

    addFromResource(data) {
        for (var key in data) {
            if (data[key]['endpointUrl']) {
                if (data[key]['graphId']) {
                    this.onRegisterDatasetSourceNamedGraph([data[key]['endpointUrl']], [data[key]['graphId']]);
                } else {
                    this.onRegisterDatasetSourceEndpoint([data[key]['endpointUrl']]);
                }
            }
        }
    },

    /**
     * Returns dataset source that is currently selected in the app
     *
     * @returns {DatasetSource}
     */
    getSelectedDatasetSource: function () {
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
        const toSend = {
            action: Actions.registerDatasetSourceEndpoint,
            datasetSource: new SparqlEndpointDatasetSource(endpointUrl)
        };
        Ajax.put(this.base + "/?endpointUrl=" + endpointUrl).end(
            (data) => this._registerDatasetSourceSuccess(toSend,data),
            () => this._registerDatasetSourceFail);
    },

    onRegisterDatasetSourceNamedGraph: function (endpointUrl, graphIri) {
        const toSend = {
            action: Actions.registerDatasetSourceNamedGraph,
            datasetSource: new NamedGraphSparqlEndpointDatasetSource(endpointUrl, graphIri)
        };
        Ajax.put(this.base + "/?endpointUrl=" + endpointUrl + "&graphIri=" + graphIri).end(
            (data) => this._registerDatasetSourceSuccess(toSend, data),
            () => this._registerDatasetSourceFail);
    },

    onRegisterDatasetSourceDownloadUrl: function (downloadUrl) {
        const toSend = {
            action: Actions.registerDatasetUrl,
            datasetSource: new UrlDatasetSource(downloadUrl)
        };
        const ds = new UrlDatasetSource(downloadUrl);
        Ajax.put(this.base + "/?downloadUrl=" + downloadUrl).end(
            (data) => this._registerDatasetSourceSuccess(toSend, data),
            () => this._registerDatasetSourceFail);
    },

    _registerDatasetSourceSuccess(toSend, data) {
        Logger.log('Endpoint ' + data + ' registered.');
        toSend.datasetSource.id = data;
        this.trigger(toSend);
    },

    _registerDatasetSourceFail(toSend) {
        Logger.error('Unable to register endpoint.');
        toSend.datasetSource = null;
        this.trigger(toSend);
    },

    _parseDatasetSource: function (ds) {
        var datasetSource = null;
        if (ds.type === Ddo.NS + "named-graph-sparql-endpoint-dataset-source") {
            datasetSource = new NamedGraphSparqlEndpointDatasetSource(ds.endpointUrl, ds.graphId);
        } else if (ds.type === Ddo.NS + "sparql-endpoint-dataset-source") {
            datasetSource = new SparqlEndpointDatasetSource(ds.endpointUrl);
        } else if (ds.type === Ddo.NS + "url-dataset-source") {
            datasetSource = new UrlDatasetSource(ds.downloadUrl);
        }

        if (datasetSource != null) {
            datasetSource.id = ds.id;
            datasetSource.hash = ds.hash;
        } else {
            throw new Error("Unknown dataset source type - " + ds.type);
        }
        return datasetSource;
    },

    hierarchizeDS: function (dss) {
        const roots = {}
        dss.forEach((ds) => {
            if (ds.type == Ddo.NS + "sparql-endpoint-dataset-source") {
                if (roots[ds.endpointUrl]) {
                    if (roots[ds.endpointUrl].generated) {
                        roots[ds.endpointUrl] = ds;
                    } else {
                        console.log("WARNING - duplicate SPARQL endpoint source, using the last - " + ds.endpointUrl);
                    }
                } else {
                    roots[ds.endpointUrl] = ds;
                }
            } else if (ds.type == Ddo.NS + "named-graph-sparql-endpoint-dataset-source") {
                if (!roots[ds.endpointUrl]) {
                    roots[ds.endpointUrl] = new SparqlEndpointDatasetSource(ds.endpointUrl);
                    roots[ds.endpointUrl].generated = true;
                    roots[ds.endpointUrl]._id = ds.endpointUrl;
                }
                roots[ds.endpointUrl].parts.push(ds);
            }
        });
        return roots;
    },

    onGetAllDatasetSources: function () {
        const toSend = {
            action: Actions.getAllDatasetSources,
        };

        Ajax.get(this.base + "/").end(function (data) {
            let dss = data.map(this._parseDatasetSource);
            let roots = this.hierarchizeDS(dss);

            console.log("Root objects: " + Object.values(roots).length);
            toSend.datasetSources = Object.values(roots)
            this.trigger(toSend);
        }.bind(this), function () {
            Logger.error('Unable to get data.');
            this.datasetSources = null;
            this.trigger(toSend);
        }.bind(this));
    },

    onExecuteQueryForDatasetSource: function (datasetSourceId, queryName, params) {
        const _executeQueryFail = function(toSend) {
            Logger.error('Unable to execute query.');
            toSend.jsonLD = []
            this.trigger(toSend);
        }.bind(this);
        const toSend = {
            action: Actions.executeQueryForDatasetSource,
            queryName: queryName,
            params: params,
            datasetSourceId: datasetSourceId
        };
        const url = Utils.addParametersToUrl(this.base + "/" + datasetSourceId + "/actions/query?queryFile=" + queryName, params)
        Ajax.get(url).end(function (data) {
            const that = this;
            jsonld.flatten(data, function (err, canonical) {
                if (err) {
                    toSend.error=err
                    _executeQueryFail(toSend)
                } else {
                    toSend.jsonLD = canonical;
                    that.trigger(toSend);
                }
            });
        }.bind(this),() => _executeQueryFail(toSend));
    },

    onGetDescriptorsForDatasetSource: function (datasetSourceId, descriptorTypeId) {
        const toSend = {
            action: Actions.getDescriptorsForDatasetSource,
            descriptorTypeId: descriptorTypeId,
            datasetSourceId: datasetSourceId
        };
        Ajax.get(this.base + "/" + datasetSourceId + "/descriptor?descriptorTypeIri=" + descriptorTypeId).end(function (data) {
            toSend.descriptors = data;
            this.trigger(toSend);
        }.bind(this), function () {
            Logger.error('Unable to fetch descriptors of type ' + descriptorTypeId + ' for the dataset source id ' + datasetSourceId);
            toSend.descriptors = [];
            this.trigger(toSend);
        }.bind(this));
    }
});

module.exports = DatasetSourceStore;