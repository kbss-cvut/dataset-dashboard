'use strict';

import React from "react";
import SchemaWidgetComponent from "./SchemaWidgetComponent";
import LoadingWrapper from "../../../misc/LoadingWrapper";
import DescriptorWidgetWrapper from "../DescriptorWidgetWrapper";
import Ddo from "../../../../vocabulary/Ddo";

export default LoadingWrapper(DescriptorWidgetWrapper(SchemaWidgetComponent, Ddo.NS + "spo-summary-descriptor", "spo/spo-summary"),
    {maskClass: 'mask-container'});