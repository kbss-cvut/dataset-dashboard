'use strict';

import Reflux from "reflux";
import Actions from "../actions/Actions";

export default class DashboardContextStore extends Reflux.Store {

    constructor()
    {
        super();
        this.state = { excludedEntities: []};
        this.listenables = [Actions]
    }

    onExcludeEntities(entities) {
        this.setState({excludedEntities : entities})
    }
}