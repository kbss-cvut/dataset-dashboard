'use strict';

import React from "react";
import DatasetSourceStore from "../../../stores/DatasetSourceStore";
import DatasetDescriptorStore from "../../../stores/DatasetDescriptorStore";
import DashboardContextStore from "../../../stores/DashboardContextStore";
import Actions from "../../../actions/Actions";
import DescriptorWidgetSelector from "./DescriptorWidgetSelector";
import FullscreenWidgetPanelUI from "./FullscreenWidgetPanelUI";
import LoadingWrapper from "../../misc/LoadingWrapper";
import {Button, Glyphicon} from "react-bootstrap";

class WidgetPanel extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            excludedEntities: [],
            descriptorTypeIris: this.props.descriptorTypeIris,
            descriptorQuery: this.props.descriptorQuery,
            descriptors: [],
            selectedDescriptor: {
                id: null,
                content: null
            },
            datasetSource: null
        };
    }

    componentWillMount() {
        this.unsubscribe1 = DatasetSourceStore.listen(this._onDescriptorsLoaded.bind(this));
        this.unsubscribe2 = DatasetDescriptorStore.listen(this._onDescriptorsLoaded.bind(this));
        this.unsubscribe3 = DashboardContextStore.listen(this._onDescriptorsLoaded.bind(this));
        this.getCurrentDatasetSource();
        this.setExcludedEntities(DashboardContextStore.getExcludedEntities());
    };

    setExcludedEntities(entities) {
        const entities2 = entities.slice(0);
        this.setState({
            excludedEntities : entities
        });
    }

    componentWillUnmount() {
        this.unsubscribe1();
        this.unsubscribe2();
        this.unsubscribe3();
    };

    getCurrentDatasetSource() {
        const datasetSource = DatasetSourceStore.getSelectedDatasetSource()
        if (datasetSource) {
            this.props.loadingOn();
            Actions.getDescriptorsForDatasetSource(
                datasetSource.id,
                this.state.descriptorTypeIris);
            this.setState({
                datasetSource: datasetSource,
            });
        }
    };

    selectDatasetSource(id, state) {
        if (!state.selectedDescriptor) {
            state.selectedDescriptor = {};
        }
        if (id) {
            state.selectedDescriptor.id = id;
            Actions.getDescriptorContent(id, this.state.descriptorQuery);
        } else {
            state.selectedDescriptor.id = null;
            state.selectedDescriptor.content = null;
        }
        return state;
    };

    _onDescriptorsLoaded = (data) => {
        if (data.action === Actions.selectDatasetSource) {
            this.getCurrentDatasetSource();
        } else if (data.action === Actions.excludeEntities) {
            this.setExcludedEntities( data.entities );
        } else if (data.action === Actions.getDescriptorsForDatasetSource) {
            if (this.state.descriptorTypeIris == data.descriptorTypeIris) {
                this.props.loadingOff();
                const state = {
                    descriptors: data.descriptors,
                    selectedDescriptor: {id: null, content: null}
                }
                if (data.descriptors && data.descriptors[0]) {
                    this.selectDatasetSource(data.descriptors[0].id, state);
                }
                this.setState(state);
            }
        } else if (data.action === Actions.getDescriptorContent) {
            if (this.state.selectedDescriptor && (data.descriptor.id == this.state.selectedDescriptor.id)) {
                this.props.loadingOff();
                this.setState({selectedDescriptor: data.descriptor});
            }
        } else if (data.action === Actions.computeDescriptorForDatasetSource) {
            if (this.state.descriptorTypeIris.includes(data.descriptorTypeId)) {
                this.props.loadingOff();

                const descriptors = this.state.descriptors;
                descriptors.push(data.descriptor);
                const state = {descriptors: descriptors}
                this.selectDatasetSource(data.descriptor.id, state);
                this.setState(state);
            }
        } else if (data.action === Actions.removeDescriptorForDatasetSource) {
            this.props.loadingOff();
            const descriptors = this.state.descriptors.filter(function (obj) {
                return obj.id !== data.datasetDescriptorIri;
            });
            let state = {}
            state.selectedDescriptor = null;
            if (descriptors && descriptors.length > 0) {
                this.selectDatasetSource(descriptors[0].id, state);
            }
            state.descriptors = descriptors;
            this.setState(state);
        }
    };

    handleChange(id) {
        const state = {}
        this.selectDatasetSource(id, state);
        this.setState(state);
    }

    handleExecute(t) {
        this.props.loadingOn();
        Actions.computeDescriptorForDatasetSource(
            this.state.datasetSource.id,
            t
        );
    }

    handleRemove(event) {
        this.props.loadingOn();
        Actions.removeDescriptorForDatasetSource(
            this.state.selectedDescriptor.id
        );
    }

    render() {
        const c = [];
        if (this.state.descriptors) {
            c.push(<DescriptorWidgetSelector
                key="selector"
                handleChangeDescriptor={(id) => this.handleChange(id)}
                descriptors={this.state.descriptors}
                selectedDescriptor={this.state.selectedDescriptor}/>
            );
        }
        this.state.descriptorTypeIris.forEach((t) => {
            c.push(<Button
                key={"buttonExecute-" + t}
                bsSize="small"
                title={"Compute a descriptor of type " + t}
                onClick={() => this.handleExecute(t)}>
                <Glyphicon glyph="play"/>
            </Button>);
        });

        c.push(<Button
            key="buttonDelete"
            bsSize="small"
            onClick={this.handleRemove.bind(this)}
            disabled={!this.state.selectedDescriptor}>
            <Glyphicon glyph="remove"/>
        </Button>);

        const content = this.state.selectedDescriptor ? this.state.selectedDescriptor.content : null;
        return (
            <FullscreenWidgetPanelUI
                title={this.props.title}
                components={c}
                widget={!content ?
                    <div style={{textAlign: "center", verticalAlign: "center"}}>
                        No Dataset Descriptor Selected
                    </div> : this.props.widget(content, this.state.excludedEntities)}/>);
    };
}

export default LoadingWrapper(WidgetPanel, {maskClass: 'mask-container'})