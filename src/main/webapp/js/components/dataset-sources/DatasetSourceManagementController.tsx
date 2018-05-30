'use strict';

import * as React from "react";
import DatasetSourcePanel from "./DatasetSourcePanel";
import DatasetSourceRegistration from "./DatasetSourceRegistration";
import {MainNavBar} from "../navigation/MainNavBar";

export const DatasetSourceManagementController : React.SFC = (props) => (
    <div>
        <MainNavBar/>
        <DatasetSourceRegistration/>
        <DatasetSourcePanel/>
    </div>
);
