'use strict';

import React from "react";
import DatasetSourceStore from "../../../stores/DatasetSourceStore";
import DatasetDescriptorStore from "../../../stores/DatasetDescriptorStore";
import Actions from "../../../actions/Actions";
import DescriptorWidgetSelector from "./DescriptorWidgetSelector";
import FullscreenWidgetPanelUI from "./FullscreenWidgetPanelUI";
import LoadingWrapper from "../../misc/LoadingWrapper";
import {Button, Glyphicon} from "react-bootstrap";

class WidgetPanel extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            descriptorTypeIri: this.props.descriptorTypeIri,
            descriptorQuery: this.props.descriptorQuery,
            descriptors: []
        };
    }

    componentWillMount() {
        this.unsubscribe1 = DatasetSourceStore.listen(this._onDescriptorsLoaded.bind(this));
        this.unsubscribe2 = DatasetDescriptorStore.listen(this._onDescriptorsLoaded.bind(this));
        this.getCurrentDatasetSource();
    };

    componentWillUnmount() {
        this.unsubscribe1();
        this.unsubscribe2();
    };

    getCurrentDatasetSource() {
        const datasetSource = DatasetSourceStore.getSelectedDatasetSource()
        if (datasetSource) {
            this.props.loadingOn();
            Actions.getDescriptorsForDatasetSource(
                datasetSource.id,
                this.state.descriptorTypeIri);
            this.setState({
                datasetSource: datasetSource,
                descriptorContent: null
            });
        }
    }

    _onDescriptorsLoaded = (data) => {
        if (data.action === Actions.selectDatasetSource) {
            this.getCurrentDatasetSource();
        } else if (data.action === Actions.getDescriptorsForDatasetSource) {
            if (data.descriptorTypeId == this.state.descriptorTypeIri) {
                this.props.loadingOff();
                const state = {
                    descriptors: data.descriptors,
                    descriptorContent: null
                }
                if (data.descriptors && data.descriptors[0]) {
                    const id = data.descriptors[0].id;
                    this.props.loadingOn();
                    Actions.getDescriptorContent(id, this.state.descriptorQuery);
                    state.selectedDescriptorId = id;
                }
                this.setState(state);
            }
        } else if (data.action === Actions.getDescriptorContent) {
            if (data.descriptorId == this.state.selectedDescriptorId) {
                this.props.loadingOff();

                this.setState({
                    descriptorId: data.descriptorId,
                    descriptorContent: data.jsonLD,
                });
            }
        }
    };

    handleChange(id) {
        Actions.getDescriptorContent(id, this.state.descriptorQuery);
        this.setState({
            selectedDescriptorId: id
        });
    }

    handleClick(event) {
        Actions.computeDescriptorForDatasetSource(
            this.state.datasetSource.id,
            this.state.descriptorTypeIri
        );
    }

    render() {
        const c = [];
        if (this.state.descriptors) {
            c.push(<DescriptorWidgetSelector
                key="selector"
                handleChangeDescriptor={this.handleChange.bind(this)}
                descriptors={this.state.descriptors}
                descriptor={this.state.selectedDescriptorId}/>
            );
        }
        c.push(<Button
            key="buttonExecute"
            bsSize="small"
            onClick={this.handleClick.bind(this)}>
            <Glyphicon glyph="play"/>
        </Button>);

        return (
            <FullscreenWidgetPanelUI
                title={this.props.title}
                components={c}
                widget={!this.state.descriptorContent ?
                    <div style={{textAlign: "center", verticalAlign: "center"}}>
                        No Dataset Descriptor Selected
                    </div> : this.props.widget(this.state.descriptorContent, this.state.datasetSource)}/>);
    };
}

export default LoadingWrapper(WidgetPanel, {maskClass: 'mask-container'})