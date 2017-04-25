'use strict';

import React from "react";
import Dashboard, {addWidget} from "react-dazzle";
import EditBar from "./EditBar";
import Container from "./Container";
import CustomFrame from "./CustomFrame";
import DatasetSourceStore from "../../stores/DatasetSourceStore";
import Actions from "../../actions/Actions";
import SkosWidget from "./widgets/skos-widget/SkosWidget";
import DatasetSourceRow from "./DatasetSourceRow";

class DashboardController extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            widgets: {
                SkosWidget: {
                    type: SkosWidget,
                    title: 'SKOS Widget',
                }
            },
            layout: {
                rows: [{
                    columns: [{
                        className: 'col-md-6 col-sm-6 col-xs-6',
                        widgets: [{key: 'SkosWidget'}],
                    }],
                }]
            },
            data: [],
            datasetSourceId: null,
            editMode: false,
            isModalOpen: false,
            addWidgetOptions: null,
        };
    };

    componentWillMount() {
        this.unsubscribe = DatasetSourceStore.listen(this._onDataLoaded);
    };

    _onDataLoaded = (data) => {
        if (data === undefined) {
            return
        }

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
        var datasetSources = this.state.data.map((ds) => { return <DatasetSourceRow key={ds.hash} datasetSource={ds}/> });

        return (<div><h1>Dataset Source </h1>
            <div>
                <table>
                    <thead>
                    <tr>
                        <td>Dataset Source</td>
                    </tr>
                    </thead>
                    <tbody>
                    {datasetSources}
                    </tbody>
                </table>
            </div>
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
            </Container></div>);
    }
}

export default DashboardController;
