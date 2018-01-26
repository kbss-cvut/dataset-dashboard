'use strict';

import React from "react";
import DatasetSourceStore from "../../stores/DatasetSourceStore";
import Actions from "../../actions/Actions";
import VocabularyWidget from "./widgets/vocabulary-widget/VocabularyWidget";
import SchemaWidget from "./widgets/schema-widget/SchemaWidget";
import SpatialWidget from "./widgets/spatial-widget/SpatialWidget";
import ClassPartitionWidget from "./widgets/basic-stats-widget/ClassPartitionWidget";
import PropertyPartitionWidget from "./widgets/basic-stats-widget/PropertyPartitionWidget";
import ResponsiveReactGridLayout from "react-grid-layout";
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
        var title = <h1>Dataset Source <DatasetSourceLabel datasetSource={this.state.selectedDatasetSource}/></h1>;

        var layout = [
            // {i: 'a', x: 0, y: 0, w: 1, h: 2, static: true},
            {i: 'main', x: 0, y: 0, w: 14, h: 23, minW: 14, maxW: 20},
            {i: 'righttop', x: 15, y: 0, w: 6, h: 11},
            {i: 'rightbottom', x: 15, y: 7, w: 6, h: 12},
            {i: 'downleft', x: 0, y: 23, w: 10, h: 20},
            {i: 'downright', x: 10, y: 23, w: 10, h: 20}
        ];

        return (<div>
            <Panel header={title} bsStyle="info">
                <ResponsiveReactGridLayout
                    className="layout"
                    layout={layout}
                    cols={20}
                    rowHeight={30}
                    width={1200}>
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
