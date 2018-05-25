'use strict';

import * as React from "react";
import ClassPartitionWidgetComponent from "./ClassPartitionWidgetComponent";

import SingleSparqlWidget from '../SingleSparqlWidget';

const ClassPartitionWidget = () =>
    ( <SingleSparqlWidget
        query="void/class_partitions"
        widget={(data, entities, onExcludeEntites) => ( <ClassPartitionWidgetComponent data={data}
                                                                    excludedEntities={entities}
                                                                    onExcludeEntities={onExcludeEntites}/>)}/> );

export default ClassPartitionWidget;
