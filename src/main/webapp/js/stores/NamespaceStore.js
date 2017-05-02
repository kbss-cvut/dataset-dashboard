'use strict';

const Reflux = require('reflux');

const Actions = require('../actions/Actions');
const Ajax = require('../utils/Ajax');
const Logger = require('../utils/Logger');

const jsonld = require('jsonld');

const NamespaceStore = Reflux.createStore({

    listenables: [Actions],

    namespaces: [],

    getPrefix: function(namespace) {
        return this.namespaces[namespace];
    },

    onRegisterNamespace: function( namespace,prefix) {
        return this.namespaces[namespace] = prefix;
    },
});

module.exports = NamespaceStore;