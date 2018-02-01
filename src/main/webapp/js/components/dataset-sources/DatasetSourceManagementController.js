'use strict';

import React from "react";
import DatasetSourcePanel from "./DatasetSourcePanel";
import DatasetSourceRegistration from "./DatasetSourceRegistration";
import MainNavBar from "../navigation/MainNavBar";

const DatasetSourceManagementController = () => (
    <div>
        <MainNavBar/>
        <DatasetSourceRegistration/>
        <DatasetSourcePanel/>
    </div>
);
export default DatasetSourceManagementController;
