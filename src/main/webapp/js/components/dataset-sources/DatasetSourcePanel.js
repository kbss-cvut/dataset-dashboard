'use strict';

import * as React from "react";
import {Panel} from "react-bootstrap";
import RefreshDatasetSourcesButton from "./RefreshDatasetSourcesButton";

const DatasetSourcePanel = () => (
    <Panel header={<div>Filter Dataset Source <RefreshDatasetSourcesButton/></div>}>
        <DatasetSourceTree/>
    </Panel>
);
export default DatasetSourcePanel;
