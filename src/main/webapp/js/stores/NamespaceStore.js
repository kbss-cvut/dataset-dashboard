'use strict';

import Reflux from 'reflux';
import Actions from '../actions/Actions';
const namespacesAdHoc = require('../../resources/namespaces/ad-hoc.json');
const namespacesPrefixcc = require('../../resources/namespaces/prefix-cc.json');

const NamespaceStore = Reflux.createStore({

    listenables: [Actions],
    namespaces: {},

    init() {
        this.addFromResource(namespacesPrefixcc);
        this.addFromResource(namespacesAdHoc);
    },

    list() {
        return this.namespaces;
    },

    addFromResource(data) {
        for (var key in data) {
            this.namespaces[data[key]]=key;
        }
    },

    getPrefix: function(namespace) {
        return this.namespaces[namespace];
    },

    // calculate a short form of a uri
    getShortForm: function(uri){
        if ( uri == null ) {
           return "";
    } else
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