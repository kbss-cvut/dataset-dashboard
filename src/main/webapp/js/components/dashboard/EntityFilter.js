'use strict';

import React from "react";

import EntityFilterUI from "./EntityFilterUI";
import Actions from "../../actions/Actions";

import DashboardContextStore from "../../stores/DashboardContextStore";

export default class EntityFilter extends React.Component {

    constructor(props)
    {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        this.unsubscribe = DashboardContextStore.listen(this._onDataLoaded);
        this.setState({excludedEntities: DashboardContextStore.getExcludedEntities()});
    };

    _onDataLoaded = (data) => {
        if (data === undefined) {
            return
        }

        if ( data.action === Actions.excludeEntities ) {
            this.setState({excludedEntities: data.entities})
        }
    }

    componentWillUnmount() {
        this.unsubscribe();
    };

    includeEntity(entity) {
        const entities = this.state.excludedEntities.slice(0);
        entities.splice(entities.indexOf(entity), 1);
        Actions.excludeEntities(entities)
    };

    render() {
        return (
            <EntityFilterUI entities={this.state.excludedEntities}
                            includeEntity={(entity) => this.includeEntity(entity)}/> );
    }
}