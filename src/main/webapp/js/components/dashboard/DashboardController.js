'use strict';

import React from "react";
import Dashboard, {addWidget} from "react-dazzle";
import EditBar from "./EditBar";
import Container from "./Container";
import CustomFrame from "./CustomFrame";
import DatasetSourceStore from "../../stores/DatasetSourceStore";
import Actions from "../../actions/Actions";
import SkosWidget from "./widgets/skos-widget/SkosWidget";
import SchemaWidget from "./widgets/schema-widget/SchemaWidget";
import SpatialWidget from "./widgets/spatial-widget/SpatialWidget"
import ClassPartitionWidget from "./widgets/basic-stats-widget/ClassPartitionWidget";
import PropertyPartitionWidget from "./widgets/basic-stats-widget/PropertyPartitionWidget";
import DatasetSourceLabel from "./DatasetSourceLabel";
import {Table, Panel, Grid, Row, Col} from "react-bootstrap";
import DatasetSourceList from "./DatasetSourceList";

class DashboardController extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            widgets: {
                SkosWidget: {
                    type: SkosWidget,
                    title: 'SKOS',
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
                            className: 'col-md-6 col-sm-6 col-xs-6',
                            widgets: [{key: 'SkosWidget'}],
                        },
                        {
                            className: 'col-md-6 col-sm-6 col-xs-6',
                            widgets: [{key: 'SpatialWidget'}],
                        },
                        {
                            className: 'col-md-6 col-sm-6 col-xs-6',
                            widgets: [{key: 'ClassPartitionWidget'}, {key: 'PropertyPartitionWidget'}],
                        }
                        ]
                    }
                ]
            },
            selectedDatasetSource: null,
            data: [],
            editMode: false,
            isModalOpen: false,
            addWidgetOptions: null,
        };
    };

    componentWillMount() {
        Actions.getAllDatasetSources();
        this.unsubscribe = DatasetSourceStore.listen(this._onDataLoaded);
    };

    _onDataLoaded = (data) => {
        if (data === undefined) {
            return
        }

        if (data.action == Actions.selectDatasetSource) {
            this.setState({
                selectedDatasetSource: data.datasetSource,
            });
        } else
        if (data.action == Actions.getAllDatasetSources) {
            this.setState({
                data: data.datasetSources,
            });
        }
    };

    componentWillUnmount() {
        this.unsubscribe();
    };

    /**
     * When a widget moved, this will be called. Layout should be given back.
     */
    onMove = (layout) => {
        this.setState({
            layout: layout,
        });
    };

    /**
     * Toggles edit mode in dashboard.
     */
    toggleEdit = () => {
        this.setState({
            editMode: !this.state.editMode,
        });
    };

    render() {
        var datasetSources = this.state.data.map((ds) => { return <DatasetSourceLabel key={ds.hash} datasetSource={ds}/> });
        var title = <h1>Dataset Source <DatasetSourceLabel datasetSource={this.state.selectedDatasetSource}/></h1>;
        return (<div>
            <Grid>
                <Row className="show-grid">
                    <Col xs={6} md={4}>
                        <DatasetSourceList data={datasetSources}/>
                    </Col>
                    <Col xs={12} md={8}>
                        <Panel header={title} bsStyle="info">
                            <Container>
                                <EditBar onEdit={this.toggleEdit}/>
                                <Dashboard
                                    frameComponent={CustomFrame}
                                    layout={this.state.layout}
                                    widgets={this.state.widgets}
                                    editable={this.state.editMode}
                                    onMove={this.onMove}
                                    addWidgetComponentText=""
                                />
                            </Container>
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        </div>);
    }
}

export default DashboardController;
