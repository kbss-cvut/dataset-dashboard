/**
 * Created by kremep1 on 23/05/18.
 */

import React from "react";
import {Button,Glyphicon} from "react-bootstrap";
import Utils from "../../../../utils/Utils";

export default class RenderUtils {

    static format(namespaces, cell, resourceSelected) {
        let x = Utils.getShortForm(namespaces,cell);
        if ( resourceSelected.select ) {
            x = <del> {x} </del>
        }
        return <a href={cell} target="_blank">{x}</a>;
    };

    static formatSelect(cell, resource, excludedEntities, onExcludeEntities) {
        return <Button bsSize="xsmall" onClick={() => {
            const newExcludedEntities = excludedEntities.slice(0);
            if ( cell ) {
                const newX = newExcludedEntities.indexOf(resource)
                if ( newX > -1 ) {
                    newExcludedEntities.splice(newX,1);
                }
            } else {
                if ( !newExcludedEntities.includes(resource)) {
                    newExcludedEntities.push(resource);
                }
            }
            onExcludeEntities(newExcludedEntities)
        }}>{cell ? <Glyphicon glyph="plus"/> : <Glyphicon glyph="minus"/>}</Button>;
    };
}