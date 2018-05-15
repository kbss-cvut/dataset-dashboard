'use strict';

import Reflux from "reflux";
import Actions from "../actions/Actions";

const DashboardContextStore = Reflux.createStore({

    listenables: [Actions],
    excludedEntities: [],

    onExcludeEntities(entities) {
        this.excludedEntities = entities;
        this.trigger({
            action: Actions.excludeEntities,
            entities: this.excludedEntities
        });
    },

    getExcludedEntities() {
        return this.excludedEntities;
    }
});

module.exports = DashboardContextStore;