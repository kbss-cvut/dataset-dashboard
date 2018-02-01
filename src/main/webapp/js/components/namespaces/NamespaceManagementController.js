'use strict';

import React from "react";
import MainNavBar from "../navigation/MainNavBar";
import NamespaceList from "../namespaces/NamespaceList";

const NamespaceManagementController = () => (
    <div>
        <MainNavBar/>
        <NamespaceList/>
    </div>);
export default NamespaceManagementController;