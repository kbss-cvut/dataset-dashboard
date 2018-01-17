'use strict';

import React from "react";
import Dashboard, {addWidget} from "react-dazzle";
import EditBar from "./EditBar";
import Container from "./Container";
import CustomFrame from "./CustomFrame";
import DatasetSourceStore from "../../stores/DatasetSourceStore";
import Actions from "../../actions/Actions";
import VocabularyWidget from "./widgets/vocabulary-widget/VocabularyWidget";
import SchemaWidget from "./widgets/schema-widget/SchemaWidget";
import SpatialWidget from "./widgets/spatial-widget/SpatialWidget";
import ClassPartitionWidget from "./widgets/basic-stats-widget/ClassPartitionWidget";
import PropertyPartitionWidget from "./widgets/basic-stats-widget/PropertyPartitionWidget";
import DatasetSourceLabel from "./DatasetSourceLabel";
import {Panel} from "react-bootstrap";

class DashboardController extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            widgets: {
                VocabularyWidget: {
                    type: VocabularyWidget,
                    title: 'Vocabulary',
                },
                SchemaWidget: {
                    type: SchemaWidget,
                    title: 'Schema',
                },
                ClassPartitionWidget: {
                    type: ClassPartitionWidget,
                    title: 'Class Partitions',
                },
                PropertyPartitionWidget: {
                    type: PropertyPartitionWidget,
                    title: 'Property Partitions',
                },
                SpatialWidget: {
                    type: SpatialWidget,
                    title: 'Spatial representation',
                }
            },
            layout: {
                rows: [
                    {
                        columns: [
                            {
                                className: 'col-md-12 col-sm-12 col-xs-12',
                                widgets: [{key: 'SchemaWidget'}],
                            },
                            {
                                className: 'col-md-12 col-sm-12 col-xs-12',
                                widgets: [{key: 'VocabularyWidget'}],
                            },
                            {
                                 className: 'col-md-12 col-sm-12 col-xs-12',
                                 widgets: [{key: 'SpatialWidget'}],
                            },
                            {
                                className: 'col-md-12 col-sm-12 col-xs-12',
                                widgets: [{key: 'ClassPartitionWidget'}, {key: 'PropertyPartitionWidget'}],
                            }
                        ]
                    }
                ]
            },
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

    /**
     * When a widget moved, this will be called. Layout should be given back.
     */
    onMove(layout) {
        this.setState({
            layout: layout,
        });
    };

    /**
     * Toggles edit mode in dashboard.
     */
    toggleEdit() {
        this.setState({
            editMode: !this.state.editMode,
        });
    };

    render() {
        var title = <h1>Dataset Source <DatasetSourceLabel datasetSource={this.state.selectedDatasetSource}/></h1>;
        return (<div>
            <Panel header={title} bsStyle="info">
                <Container>
                    <EditBar onEdit={() => this.toggleEdit()}/>
                    <Dashboard
                        frameComponent={CustomFrame}
                        layout={this.state.layout}
                        widgets={this.state.widgets}
                        editable={this.state.editMode}
                        onMove={(layout) => this.onMove(layout)}
                        addWidgetComponentText=""
                    />
                </Container>
            </Panel>
        </div>);
    }
}

export default DashboardController;
