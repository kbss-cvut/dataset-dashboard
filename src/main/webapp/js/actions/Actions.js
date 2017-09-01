'use strict';

const Reflux = require('reflux');

module.exports = Reflux.createActions([
    'registerDatasetSourceEndpoint',
    'registerDatasetSourceNamedGraph',
    'registerDatasetUrl',
    'getAllDatasetSources',
    'executeQueryForDatasetSource',
    'selectDatasetSource',
    'computeDescriptorForDatasetSource',
    'getDescriptorsForDatasetSource',
    'getDescriptorForLastSnapshotOfDatasetSource',
    'registerNamespace',
    'getDescriptorContent'
]);
