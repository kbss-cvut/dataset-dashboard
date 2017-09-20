'use strict';

import Reflux from 'reflux';
import jsonld from 'jsonld';
import Actions from '../actions/Actions';
import Ajax from '../utils/Ajax';
import Logger from '../utils/Logger';

const BASE_URL = 'rest/dataset-descriptor';

const DatasetDescriptorStore = Reflux.createStore({

    listenables: [Actions],

    onGetDescriptorContent: function (descriptorId, fileName) {
        const toSend = {
            action: Actions.getDescriptorContent,
            descriptorId: descriptorId,
            fileName: fileName
        };

        let url = BASE_URL+"/actions/content?id="+descriptorId;
        if (fileName) {
            url = url + "&fileName=" + fileName;
        }
        Ajax.get(url).end(function (data) {
            const that = this;
            jsonld.flatten(data, function(err, canonical) {
                toSend.jsonLD = canonical;
                that.trigger(toSend);
            });
        }.bind(this), function () {
            Logger.error('Unable to fetch descriptor id ' + descriptorId);
            toSend.jsonLD = [];
            this.trigger(toSend);
        }.bind(this));
    },

    onComputeDescriptorForDatasetSource: function (datasetSourceId, descriptorTypeIri) {
        Ajax.get(BASE_URL+"/actions/compute?descriptorTypeIri="+descriptorTypeIri + "&datasetSourceId="+datasetSourceId).end(function (data) {
            const that = this;
            jsonld.flatten(data, function(err, canonical) {
                that.trigger({
                    action: Actions.computeDescriptorForDatasetSource,
                    descriptorTypeId: descriptorTypeIri,
                    datasetSourceId: datasetSourceId,
                    jsonLD: canonical
                });
            });
        }.bind(this), function () {
            Logger.error('Unable to compute descriptors of type '+ descriptorTypeIri+' for the dataset source id ' + datasetSourceId);
            this.trigger({
                action: Actions.computeDescriptorForDatasetSource,
                descriptorTypeId: descriptorTypeIri,
                datasetSourceId: datasetSourceId,
                jsonLD: []
            });
        }.bind(this));
    },
});

module.exports = DatasetDescriptorStore;