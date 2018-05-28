'use strict';

import * as React from "react";
import {Glyphicon, Label} from "react-bootstrap";

interface Props {
    entities?: any[],
    includeEntity?: (entity) => void;
}

export const EntityFilterUI: React.SFC<Props> = props => {
    const tagElements = [],
        tags = props.entities;
    for (let i = 0, len = tags.length; i < len; i++) {
        tagElements.push(<Label key={tags[i].full} bsStyle='info'>
            {tags[i].abbr}
            <Glyphicon glyph='remove' className='label-glyph' title="Remove"
                       onClick={() => props.includeEntity(tags[i].full)}/>
        </Label>);
    }
    return (<div>
        <div><label className='control-label'>Excluded Entities:</label></div>
        <div className='tags'>{tagElements}</div>
    </div>);
};

EntityFilterUI.defaultProps = {
    entities: [],
    includeEntity: (entity) => {},
};
