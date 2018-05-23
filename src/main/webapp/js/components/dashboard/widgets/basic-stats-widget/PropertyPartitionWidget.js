'use strict';

import React from "react";
import PropertyPartitionWidgetComponent from "./PropertyPartitionWidgetComponent";

import SingleSparqlWidget from '../SingleSparqlWidget';

const PropertyPartitionWidget = () =>
    ( <SingleSparqlWidget
        query="void/property_partitions"
        widget={(data, entities, onExcludeEntites) => ( <PropertyPartitionWidgetComponent data={data}
                                                                                          excludedEntities={entities}
                                                                                          onExcludeEntities={onExcludeEntites}/>)}/> );

export default PropertyPartitionWidget;
