'use strict';

import React from "react";
import ClassPartitionWidgetComponent from "./ClassPartitionWidgetComponent";

import SingleSparqlWidget from '../SingleSparqlWidget';

const ClassPartitionWidget = () =>
    ( <SingleSparqlWidget
        query="void/class_partitions"
        widget={(data) => ( <ClassPartitionWidgetComponent data={data}/>)}/> );

export default ClassPartitionWidget;
