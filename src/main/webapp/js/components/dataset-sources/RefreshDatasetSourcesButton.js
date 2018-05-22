'use strict';

import React from "react";
import {Button, Glyphicon} from "react-bootstrap";
import Actions from "../../actions/Actions";

const RefreshDatasetSourcesButton = () => (
    <Button onClick={() => {Actions.refreshDatasetSources()}}>
        <Glyphicon glyph="refresh"/>
    </Button>
);
export default RefreshDatasetSourcesButton;
