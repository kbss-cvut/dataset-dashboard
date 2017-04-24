'use strict';

import React from "react";
import Dashboard, {addWidget} from "react-dazzle";
import EditBar from "./EditBar";
import Container from "./Container";
import CustomFrame from "./CustomFrame";
import DatasetSourceStore from "../../stores/DatasetSourceStore";
import Actions from "../../actions/Actions";
import SkosWidget from "./widgets/skos-widget/SkosWidget";

class DashboardController extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            widgets: {
                SkosWidget: {
                    type: SkosWidget,
                    title: 'SKOS Widget',
                    props:{datasetSourceId: 552119892}
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
            dataSourceId: null,
            editMode: false,
            isModalOpen: false,
            addWidgetOptions: null,
        }
    }

    componentWillMount() {
        this.unsubscribe = DatasetSourceStore.listen(this._onDataLoaded);
    };

    _onDataLoaded = (data) => {
        if (data === undefined) {
            return
        }

        if (data.action == Actions.getAllDatasetSources) {
            console.log(data);

            var d = data.datasetSources[0];
            if (!d) {
                d= null;
            }

            this.setState({
                data: data.datasetSources,
                datasetSourceId: d,
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

    onClick = (val) => {
        e.preventDefault();
        this.setState({
            datasetSourceId:val
        });
    }

    render() {
        var onClick = this.onClick;
        var datasetSources = this.state.data.map((ds) => {
            return <tr>
                <td>{ds.hash} ({ds.id})</td>
            </tr>;
        });

        return <div>
            <h1>{this.state.dataSourceId}</h1>
            <div>
                <table>
                    <thead>
                    <tr><td>dataset</td></tr>
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
            </Container></div>
    }
}

export default DashboardController;
