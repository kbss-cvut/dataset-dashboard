'use strict';

import Reflux from "reflux";
import jsonld from "jsonld";
import Actions from "../actions/Actions";
import Ajax from "../utils/Ajax";
import Logger from "../utils/Logger";

const BASE_URL = 'rest/dataset-descriptor';
const ACTIONS_URL = BASE_URL+'/actions';

const DatasetDescriptorStore = Reflux.createStore({

    listenables: [Actions],

    onGetDescriptorContent: function (descriptorId, fileName) {
        const toSend = {
            action: Actions.getDescriptorContent,
            descriptorId: descriptorId,
            fileName: fileName
        };

        let url = ACTIONS_URL + "/content?id=" + descriptorId;
        if (fileName) {
            url = url + "&fileName=" + fileName;
        }
        Ajax.get(url).end(function (data) {
            const that = this;
            jsonld.flatten(data, function (err, canonical) {
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
        const toSend = {
            action: Actions.computeDescriptorForDatasetSource,
            descriptorTypeId: descriptorTypeIri,
            datasetSourceId: datasetSourceId,
        }
        Ajax.get(ACTIONS_URL + "/admin/compute?descriptorTypeIri=" + descriptorTypeIri + "&datasetSourceId=" + datasetSourceId).end(function (data) {
            toSend.descriptor = data;
            this.trigger(toSend);
        }.bind(this), function (e) {
            Logger.error('Unable to compute descriptors of type ' + descriptorTypeIri + ' for the dataset source id ' + datasetSourceId);
            toSend.descriptor = null;
            this.trigger(toSend);
        }.bind(this));
    },

    onRemoveDescriptorForDatasetSource: function (datasetDescriptorIri) {
        const toSend = {
            action: Actions.removeDescriptorForDatasetSource,
            datasetDescriptorIri
        }
        Ajax.get(ACTIONS_URL + "/admin/remove?datasetDescriptorIri=" + datasetDescriptorIri)
            .end(function (data) {
            toSend.datasetDescriptorIri = data;
            this.trigger(toSend);
        }.bind(this), function (e) {
            Logger.error('Unable to remove descriptor ' + datasetDescriptorIri);
            toSend.datasetDescriptorIri = null;
            this.trigger(toSend);
        }.bind(this));
    }
});

module.exports = DatasetDescriptorStore;