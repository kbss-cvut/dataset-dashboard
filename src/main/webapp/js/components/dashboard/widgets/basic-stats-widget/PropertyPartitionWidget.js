'use strict';

import React from "react";
import PropertyPartitionWidgetComponent from "./PropertyPartitionWidgetComponent";

import SingleSparqlWidget from '../SingleSparqlWidget';

const PropertyPartitionWidget = () =>
    ( <SingleSparqlWidget
        query="void/property_partitions"
        widget={(data) => ( <PropertyPartitionWidgetComponent data={data}/>)}/> );

export default PropertyPartitionWidget;
