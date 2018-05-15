'use strict';

import React from "react";
import PropTypes from "prop-types";
import {Glyphicon, Label} from "react-bootstrap";

import NamespaceStore from "../../stores/NamespaceStore";

export default class EntityFilterUI extends React.Component {

    constructor(props) {
        super(props);
    }

    _renderTags() {
        const tagElements = [],
            tags = this.props.entities;
        for (let i = 0, len = tags.length; i < len; i++) {
            tagElements.push(<Label key={tags[i]} bsStyle='info'>
                {NamespaceStore.getShortForm(tags[i])}
                <Glyphicon glyph='remove' className='label-glyph' title="Remove"
                           onClick={() => this.props.includeEntity(tags[i])}/>
            </Label>);
        }
        return tagElements;
    }

    render() {
        return <div>
            <div><label className='control-label'>Excluded Entities:</label></div>

            <div className='tags'>
                {this._renderTags()}
            </div>
        </div>;
    }
}

EntityFilterUI.propTypes = {
    entities: PropTypes.array,
    excludeEntities: PropTypes.func,
};

EntityFilterUI.defaultProps = {
    entities: [],
    excludeEntities: (entities)=>{},
};
