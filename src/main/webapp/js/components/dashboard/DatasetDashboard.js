'use strict';

import React from "react";
import DatasetSourceStore from "../../stores/DatasetSourceStore";
import Actions from "../../actions/Actions";
import VocabularyWidget from "./widgets/vocabulary-widget/VocabularyWidget";
import SchemaWidget from "./widgets/schema-widget/SchemaWidget";
import SpatialWidget from "./widgets/spatial-widget/SpatialWidget";
import ClassPartitionWidget from "./widgets/basic-stats-widget/ClassPartitionWidget";
import PropertyPartitionWidget from "./widgets/basic-stats-widget/PropertyPartitionWidget";
import {Responsive, WidthProvider} from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);
import DatasetSourceLabel from "./DatasetSourceLabel";
import {Panel} from "react-bootstrap";
import WidgetPanelUI from "./widgets/WidgetPanelUI";

class DashboardController extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedDatasetSource: null,
            editMode: false,
            isModalOpen: false,
            addWidgetOptions: null,
        };
    };

    componentWillMount() {
        this.unsubscribe = DatasetSourceStore.listen((data) => this._onDataLoaded(data));
    };

    _onDataLoaded(data) {
        if ( (data !== undefined ) && data.action == Actions.selectDatasetSource) {
            this.setState({
                selectedDatasetSource: data.datasetSource,
            });
        }
    };

    componentWillUnmount() {
        this.unsubscribe();
    };

    widget(t,w) {
        return (<WidgetPanelUI title={t} widget={w}/>);
    };

    render() {
        const title = <h1>Dataset Source <DatasetSourceLabel datasetSource={this.state.selectedDatasetSource}/></h1>;

        const layouts = {lg: [
            // {i: 'a', x: 0, y: 0, w: 1, h: 2, static: true},
            {i: 'main', x: 0, y: 0, w: 4, h: 4, minW: 3, maxW: 4, isResizable: false},
            {i: 'righttop', x: 4, y: 0, w: 2, h: 2},
            {i: 'rightbottom', x: 4, y: 2, w: 2, h: 2},
            {i: 'downleft', x: 0, y: 5, w: 3, h: 2},
            {i: 'downright', x: 4, y: 5, w: 3, h: 2}
        ],sm: [
            // {i: 'a', x: 0, y: 0, w: 1, h: 2, static: true},
            {i: 'main', x: 0, y: 0, w: 3, h: 3, minW: 3, maxW: 3},
            {i: 'righttop', x: 0, y: 3, w: 3, h: 2},
            {i: 'rightbottom', x: 0, y: 5, w: 3, h: 2},
            {i: 'downleft', x: 0, y: 7, w: 3, h: 2},
            {i: 'downright', x: 0, y: 9, w: 3, h: 2}
        ]};

        const cols = { lg: 6, md: 4, sm: 3, xs: 2, xxs: 1 };
        return (<div>
            <Panel header={title} bsStyle="info">
                <ResponsiveReactGridLayout
                    className="layout"
                    layouts={layouts}
                    cols={cols}
                    rowHeight={210}>
                    <div key="main">{this.widget("Schema",<SchemaWidget/>)}</div>
                    <div key="righttop">{this.widget("Classes",<ClassPartitionWidget/>)}</div>
                    <div key="rightbottom">{this.widget("Properties",<PropertyPartitionWidget/>)}</div>
                    <div key="downleft">{this.widget("Geo",<SpatialWidget/>)}</div>
                    <div key="downright">{this.widget("Vocabulary",<VocabularyWidget/>)}</div>
                </ResponsiveReactGridLayout>
            </Panel>
        </div>);
    }
}

export default DashboardController;
