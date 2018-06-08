'use strict';

import * as Reflux from 'reflux';

const Actions = Reflux.createActions([
    'registerDatasetSourceEndpoint',
    'registerDatasetSourceNamedGraph',
    'registerDatasetUrl',
    'refreshDatasetSources',
    'executeQueryForDatasetSource',
    'selectDatasetSource',
    'computeDescriptorForDatasetSource',
    'removeDescriptorForDatasetSource',
    'getDescriptorsForDatasetSource',
    'getDescriptorForLastSnapshotOfDatasetSource',
    'registerNamespace',
    'getDescriptorContent',
    'excludeEntities'
]);

export default Actions;