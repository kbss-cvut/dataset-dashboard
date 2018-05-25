'use strict';

import * as React from "react";
import VocabularyWidget from "./widgets/vocabulary-widget/VocabularyWidget";
import SchemaWidget from "./widgets/schema-widget/SchemaWidget";
import SpatialWidget from "./widgets/spatial-widget/SpatialWidget";
import TemporalWidget from "./widgets/temporal-widget/TemporalWidget";
import ClassPartitionWidget from "./widgets/basic-stats-widget/ClassPartitionWidget";
import PropertyPartitionWidget from "./widgets/basic-stats-widget/PropertyPartitionWidget";
import FullscreenWidgetPanelUI from "./widgets/FullscreenWidgetPanelUI";
import WidgetPanel from "./widgets/WidgetPanel";
import {Responsive, WidthProvider} from 'react-grid-layout';
import Ddo from "../../vocabulary/Ddo";

export class DatasetDashboard extends React.Component {
    render() {
        const sm = [
            // {i: 'a', x: 0, y: 0, w: 1, h: 2, static: true},
            {i: 'main', x: 0, y: 0, w: 3, h: 4, minW: 3, maxW: 3, isDraggable:false, isResizable: false},
            {i: 'righttop', x: 0, y: 4, w: 3, h: 2},
            {i: 'rightcenter', x: 0, y: 6, w: 3, h: 2},
            {i: 'rightbottom', x: 0, y: 8, w: 3, h: 1},
            {i: 'downleft', x: 0, y: 9, w: 3, h: 4},
            {i: 'downright', x: 0, y: 17, w: 3, h: 4}

        ];

        const lg = [
            // {i: 'a', x: 0, y: 0, w: 1, h: 2, static: true},
            {i: 'main', x: 0, y: 0, w: 4, h: 5, isResizable: false, isDraggable:false},
            {i: 'righttop', x: 4, y: 0, w: 2, h: 2},
            {i: 'rightcenter', x: 4, y: 2, w: 2, h: 2},
            {i: 'rightbottom', x: 4, y: 4, w: 2, h: 1},
            {i: 'downleft', x: 0, y: 5, w: 3, h: 2, isDraggable:false},
            {i: 'downright', x: 4, y: 5, w: 3, h: 2}

        ];

        const layouts = {lg:lg,md:lg,sm:sm,xs:sm,xxs:sm };
        const cols = { lg: 6, md: 6, sm: 3, xs: 3, xxs: 3 };
        const ResponsiveReactGridLayout = WidthProvider(Responsive);
        return (<div>
                <ResponsiveReactGridLayout
                    draggableCancel="input,textarea"
                    className="layout"
                    layouts={layouts}
                    cols={cols}
                    rowHeight={210}>
                    <div key="main">{<WidgetPanel
                        title="Summary Schema"
                        widget={(content, excludedEntities) => <SchemaWidget descriptorContent={content} excludedEntities={excludedEntities}/>}
                        descriptorQuery="spo/spo-summary"
                        descriptorTypeIris={[Ddo.NS + "spo-summary-with-marginals-descriptor", Ddo.NS + "spo-summary-descriptor", Ddo.NS+"spo-summary-with-marginals--worldlod--baseline--descriptor"]}/>}</div>
                    <div key="righttop">{<FullscreenWidgetPanelUI title="Classes" widget={<ClassPartitionWidget/>} />}</div>
                    <div key="rightcenter">{<FullscreenWidgetPanelUI title="Properties" widget={<PropertyPartitionWidget/>}/>}</div>
                    <div key="rightbottom">{<WidgetPanel
                        title="Temporal"
                        widget={(content, excludedEntities) => <TemporalWidget descriptorContent={content} excludedEntities={excludedEntities}/>}
                        descriptorQuery="temporal/get_coverage"
                        descriptorTypeIris={[Ddo.NS + "temporal-function"]}/>}</div>
                    <div key="downleft">{<FullscreenWidgetPanelUI title="Geo" widget={<SpatialWidget/>}/>}</div>
                    <div key="downright">{<FullscreenWidgetPanelUI title="Vocabulary" widget={<VocabularyWidget/>}/>}</div>
                </ResponsiveReactGridLayout>
        </div>);
    }
}