'use strict';

import Reflux from 'reflux';
import Actions from '../actions/Actions';
import namespacePrefixCc from '../assets/namespaces/prefix-cc.json';
import namespaceAdHoc from '../assets/namespaces/ad-hoc.json';

export default class NamespaceStore extends Reflux.Store {

    constructor()
    {
        super();
        this.state = { namespaces: {} };
        this.listenables = [Actions];

        this.addPrefixes(namespacePrefixCc);

        this.addPrefixes(namespaceAdHoc);
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