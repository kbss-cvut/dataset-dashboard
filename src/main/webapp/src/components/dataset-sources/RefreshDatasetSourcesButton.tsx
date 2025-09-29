'use strict';

import * as React from "react";
import {Button, Glyphicon} from "react-bootstrap";
import Actions from "../../actions/Actions";

export const RefreshDatasetSourcesButton: React.FC = (props) => {
    return <Button onClick={() => {
        Actions.refreshDatasetSources()
    }}>
        <Glyphicon glyph="refresh"/>
    </Button>
}
