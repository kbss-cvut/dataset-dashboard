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

    // calculate a short form of a uri
    getShortForm: function(uri){
        if ( uri.indexOf("#") != -1 ) {
            const [namespace,id] = uri.split('#');
            const prefix=this.getPrefix(namespace+'#');
            if (prefix) {
                return prefix+':'+id;
            }
        } else if ( uri.indexOf("/") != -1 ) {
            const namespace = uri.substring(0,uri.lastIndexOf('/'))
            const id = uri.substring(uri.lastIndexOf('/') + 1)
            const prefix = this.getPrefix(namespace+'/');
            if (prefix) {
                return prefix+':'+id;
            }
        }

        return uri;
    },

    onRegisterNamespace: function( namespace,prefix) {
        return this.namespaces[namespace] = prefix;
    },
});

module.exports = NamespaceStore;