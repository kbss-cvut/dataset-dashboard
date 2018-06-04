'use strict';

import * as React from "react";
import {LinkContainer} from "react-router-bootstrap";
import {NavItem,Glyphicon} from "react-bootstrap";
import {stringify} from "qs";
import {DatasetSourceStore} from "../../stores/DatasetSourceStore";
import {DatasetSourceUtils} from "../../model/utils/DatasetSourceUtils";

export class PersistentLinkContainer extends React.Component {
    render() {
        const ds = DatasetSourceStore.getSelectedDatasetSource()
        let component
        if (ds) {
            const link = "/dashboard/online?" + stringify(DatasetSourceUtils.toQueryString(ds));
            component = <LinkContainer to={link}><NavItem><Glyphicon glyph="floppy-disk"/></NavItem></LinkContainer>;
        } else {
            component = <span></span>
        }

        return component
    }
}
