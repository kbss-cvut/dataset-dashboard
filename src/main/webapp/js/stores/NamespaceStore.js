'use strict';

import Reflux from 'reflux';
import Actions from '../actions/Actions';

export default class NamespaceStore extends Reflux.Store {

    constructor()
    {
        super();
        this.state = { namespaces: {} };
        this.listenables = [Actions];

        const namespacesPrefixcc = require('../../resources/namespaces/prefix-cc.json');
        this.addPrefixes(namespacesPrefixcc);

        const namespacesAdHoc = require('../../resources/namespaces/ad-hoc.json');
        this.addPrefixes(namespacesAdHoc);
    }

    list() {
        return this.state.namespaces;
    }

    addPrefixes(data) {
        const namespaces = this.state.namespaces;
        Object.keys(data).forEach((key) => {
            namespaces[data[key]]=key;
        })
        this.setState({namespaces:namespaces});
    }

    onRegisterNamespace( namespace, prefix ) {
        const map = {}
        map[prefix] = namespace;
        this.addPrefixes(map);
    }
}