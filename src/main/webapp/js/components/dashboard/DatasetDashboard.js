'use strict';

import React from "react";
import VocabularyWidget from "./widgets/vocabulary-widget/VocabularyWidget";
import SchemaWidget from "./widgets/schema-widget/SchemaWidget";
import SpatialWidget from "./widgets/spatial-widget/SpatialWidget";
import ClassPartitionWidget from "./widgets/basic-stats-widget/ClassPartitionWidget";
import PropertyPartitionWidget from "./widgets/basic-stats-widget/PropertyPartitionWidget";
import WidgetPanelUI from "./widgets/WidgetPanelUI";
import {Responsive, WidthProvider} from 'react-grid-layout';

export default class DashboardController extends React.Component {
    render() {
        const layouts = {lg: [
            // {i: 'a', x: 0, y: 0, w: 1, h: 2, static: true},
            {i: 'main', x: 0, y: 0, w: 4, h: 4, minW: 3, maxW: 4, isResizable: false},
            {i: 'righttop', x: 4, y: 0, w: 2, h: 2},
            {i: 'rightbottom', x: 4, y: 2, w: 2, h: 2},
            {i: 'downleft', x: 0, y: 5, w: 3, h: 2, isDraggable:false},
            {i: 'downright', x: 4, y: 5, w: 3, h: 2}
        ],sm: [
            // {i: 'a', x: 0, y: 0, w: 1, h: 2, static: true},
            {i: 'main', x: 0, y: 0, w: 3, h: 4, minW: 3, maxW: 3},
            {i: 'righttop', x: 0, y: 4, w: 3, h: 2},
            {i: 'rightbottom', x: 0, y: 6, w: 3, h: 2},
            {i: 'downleft', x: 0, y: 8, w: 3, h: 4},
            {i: 'downright', x: 0, y: 12, w: 3, h: 4}
        ]};

        const cols = { lg: 6, md: 4, sm: 3, xs: 2, xxs: 1 };
        const ResponsiveReactGridLayout = WidthProvider(Responsive);
        return (<div>
                <ResponsiveReactGridLayout
                    className="layout"
                    layouts={layouts}
                    cols={cols}
                    rowHeight={210}>
                    <div key="main">{<WidgetPanelUI title="Schema" widget={(isFullScreen) => (<SchemaWidget isFullScreen={isFullScreen}/>)}/>}</div>
                    <div key="righttop">{<WidgetPanelUI title="Classes" widget={(isFullScreen) => ( <ClassPartitionWidget/> )} />}</div>
                    <div key="rightbottom">{<WidgetPanelUI title="Properties" widget={(isFullScreen) => (<PropertyPartitionWidget/> ) }/>}</div>
                    <div key="downleft">{<WidgetPanelUI title="Geo" widget={(isFullScreen) => (<SpatialWidget/> ) }/>}</div>
                    <div key="downright">{<WidgetPanelUI title="Vocabulary" widget={(isFullScreen) => (<VocabularyWidget/> ) }/>}</div>
                </ResponsiveReactGridLayout>
        </div>);
    }
}