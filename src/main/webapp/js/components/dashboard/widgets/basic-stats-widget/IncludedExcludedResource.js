'use strict';

import React from "react";

const IncludedExcludedResource = (props) => {
    let x = props.label;
    if (props.excluded) {
        x = <del> {x} </del>
    }
    return <a href={props.entityIri} target="_blank">{x}</a>;
}

export default IncludedExcludedResource;