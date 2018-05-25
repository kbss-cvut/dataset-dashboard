import React from "react";
import {Button, Glyphicon} from "react-bootstrap";

const ExcludeButton = (props) => {
    const id = props.entityIri;
    const excludedEntities = props.excludedEntities;
    const selected = excludedEntities.includes(id);
    const newExcludedEntities = excludedEntities.slice(0);
    if (selected) {
        const newX = newExcludedEntities.indexOf(id);
        if (newX > -1) {
            newExcludedEntities.splice(newX, 1);
        }
    } else {
        if (!newExcludedEntities.includes(id)) {
            newExcludedEntities.push(id);
        }
    }
    return <Button bsSize="xsmall" onClick={() => props.onExcludeEntities(newExcludedEntities)}>
        <Glyphicon glyph={selected ? "plus" : "minus"}/>
    </Button>;
}

export default ExcludeButton;