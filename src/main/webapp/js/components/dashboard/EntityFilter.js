'use strict';

import React from "react";
import Reflux from "reflux";

import EntityFilterUI from "./EntityFilterUI";
import Actions from "../../actions/Actions";

import DashboardContextStore from "../../stores/DashboardContextStore";
import NamespaceStore from "../../stores/NamespaceStore";

import Utils from "../../utils/Utils";

export default class EntityFilter extends Reflux.Component {

    constructor(props)
    {
        super(props);
        this.state = {};
        this.stores = [DashboardContextStore,NamespaceStore];
    }

    includeEntity(entity) {
        const entities = this.state.excludedEntities.slice(0);
        entities.splice(entities.indexOf(entity), 1);
        Actions.excludeEntities(entities)
    };

    render() {
        return (
            <EntityFilterUI entities={this.state.excludedEntities.map(
                e => {
                    return {full:e,
                    abbr:(Utils.getShortForm(this.state.namespaces,e))}
                })
            } includeEntity={(entity) => this.includeEntity(entity)}/> );
    }
}