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
import DatasetSourceUtils from "../model/utils/DatasetSourceUtils";
import Ddo from "../vocabulary/Ddo";

const datasetSourcesAdHoc = require('../../resources/dataset-sources/ad-hoc.json');

const DatasetSourceStore = Reflux.createStore({

    base: 'rest/dataset-source',

    listenables: [Actions],

    selectDatasetSource: null,

    datasetSources: null,

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

    /**
     * Returns all dataset sources cached in the client
     *
     * @returns {DatasetSource[]}
     */
    getAllDatasetSources: function () {
        return this.datasetSources;
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
        Ajax.put(this.requestURL("", {endpointUrl: endpointUrl})).end(
            (data) => this._registerDatasetSourceSuccess(toSend, data),
            () => this._registerDatasetSourceFail);
    },

    onRegisterDatasetSourceNamedGraph: function (endpointUrl, graphIri) {
        const toSend = {
            action: Actions.registerDatasetSourceNamedGraph,
            datasetSource: new NamedGraphSparqlEndpointDatasetSource(endpointUrl, graphIri)
        };
        Ajax.put(this.requestURL("", {endpointUrl: endpointUrl, graphIri: graphIri})).end(
            (data) => this._registerDatasetSourceSuccess(toSend, data),
            () => this._registerDatasetSourceFail);
    },

    onRegisterDatasetSourceDownloadUrl: function (downloadUrl) {
        const toSend = {
            action: Actions.registerDatasetUrl,
            datasetSource: new UrlDatasetSource(downloadUrl)
        };
        const ds = new UrlDatasetSource(downloadUrl);
        Ajax.put(this.requestURL("", {downloadUrl: downloadUrl})).end(
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

    hierarchizeDS: function (dss) {
        const roots = {}
        dss.filter((ds) => ds.type == Ddo.SparqlEndpointDatasetSource).forEach((ds) => {
            if (!roots[ds.tempid] || roots[ds.tempid].generated) {
                roots[ds.tempid] = ds;
            } else {
                console.log("WARNING - duplicate SPARQL endpoint source, using the last - " + ds.endpointUrl);
            }
        });

        const r = Object.keys(roots);
        dss.filter((ds) => ds.type == Ddo.NamedGraphSparqlEndpointDatasetSource).forEach((ds) => {
            const endpointUrls = r.filter(c => (roots[c].endpointUrl == ds.endpointUrl));
            let root;
            if (endpointUrls.length < 1) {
                root = new SparqlEndpointDatasetSource(ds.endpointUrl);
                roots[ds.endpointUrl] = root;
                root.tempid = ds.endpointUrl;
                root.generated = true;
            } else {
                // TODO currently taking first occurrence
                root = roots[endpointUrls[0]]
            }
            root.addPart(ds);
        });
        return roots;
    },

    onRefreshDatasetSources: function () {
        const toSend = {
            action: Actions.refreshDatasetSources,
        };

        if (!this.refreshing) {
            this.refreshing = true
            Ajax.get(this.requestURL("", {})).end(function (data) {
                let dss = data.map(DatasetSourceUtils.create);
                dss.forEach(d => d.tempid = d.id);
                let roots = this.hierarchizeDS(dss);
                console.log("Root objects: " + Object.values(roots).length);
                toSend.datasetSources = Object.values(roots)
                this.datasetSources = toSend.datasetSources;
                this.refreshing = false
                this.trigger(toSend);
            }.bind(this), function () {
                Logger.error('Unable to get data.');
                this.datasetSources = null;
                this.refreshing = false
                this.trigger(toSend);
            }.bind(this));
        }
    },

    onExecuteQueryForDatasetSource: function (datasetSourceId, queryName, params) {
        const _executeQueryFail = function (toSend) {
            Logger.error('Unable to execute query.');
            toSend.content = []
            this.trigger(toSend);
        }.bind(this);
        const par = {}
        const toSend = {
            action: Actions.executeQueryForDatasetSource,
            queryName: queryName,
            params: par,
            datasetSourceId: datasetSourceId
        };
        const url = this.requestURL("actions/query", {}) + Utils.createQueryParams({
                id: datasetSourceId,
                queryFile: queryName
            }) + "&" + Utils.createQueryParams(params)
        Ajax.get(url).end(function (data) {
            const that = this;
            jsonld.flatten(data, function (err, canonical) {
                if (err) {
                    toSend.error = err
                    _executeQueryFail(toSend)
                } else {
                    toSend.content = canonical;
                    that.trigger(toSend);
                }
            });
        }.bind(this), () => _executeQueryFail(toSend));
    },

    onGetDescriptorsForDatasetSource: function (datasetSourceId, descriptorTypeIris) {
        const toSend = {
            action: Actions.getDescriptorsForDatasetSource,
            descriptorTypeIris: descriptorTypeIris,
            datasetSourceId: datasetSourceId
        };
        Ajax.get(this.requestURL("descriptor", {
            id: datasetSourceId,
            descriptorTypeIris: descriptorTypeIris.join(",")
        })).end(function (data) {
            toSend.descriptors = data;
            this.trigger(toSend);
        }.bind(this), function () {
            Logger.error('Unable to fetch descriptors of type ' + descriptorTypeIris + ' for the dataset source id ' + datasetSourceId);
            toSend.descriptors = [];
            this.trigger(toSend);
        }.bind(this));
    },

    requestURL(path, queryParamMap) {
        return this.base + "/" + path + "?" + Utils.createQueryParams(queryParamMap)
    }
});

module.exports = DatasetSourceStore;