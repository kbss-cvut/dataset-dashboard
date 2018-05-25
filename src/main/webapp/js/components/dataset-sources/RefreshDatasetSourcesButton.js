'use strict';

import * as React from "react";
import {Button, Glyphicon} from "react-bootstrap";
import Actions from "../../actions/Actions";

export class RefreshDatasetSourcesButton extends React.Component {
    render() {
        return <Button onClick={() => {
            Actions.refreshDatasetSources()
        }}>
            <Glyphicon glyph="refresh"/>
        </Button>
    }
}
