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
        } else if (data.action === Actions.computeDescriptorForDatasetSource) {
            if (data.descriptorTypeId == this.state.descriptorTypeIri) {
                this.props.loadingOff();

                const descriptors = this.state.descriptors;
                descriptors.push(data.descriptor);
                this.setState({descriptors:descriptors});
            }
        } else if (data.action === Actions.removeDescriptorForDatasetSource) {
            this.props.loadingOff();
            const descriptors = this.state.descriptors.filter(function (obj) {
                return obj.id !== data.datasetDescriptorIri;
            });
            let nextIri = null;
            if ( descriptors && descriptors.length > 0) {
                nextIri = descriptors[0].id;
            }
            this.setState({descriptors:descriptors,selectedDescriptorId:nextIri});
        }
    };

    handleChange(id) {
        Actions.getDescriptorContent(id, this.state.descriptorQuery);
        this.setState({
            selectedDescriptorId: id
        });
    }

    handleExecute(event) {
        this.props.loadingOn();
        Actions.computeDescriptorForDatasetSource(
            this.state.datasetSource.id,
            this.state.descriptorTypeIri
        );
    }

    handleRemove(event) {
        this.props.loadingOn();
        Actions.removeDescriptorForDatasetSource(
            this.state.selectedDescriptorId
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
            onClick={this.handleExecute.bind(this)}>
            <Glyphicon glyph="play"/>
        </Button>);

        c.push(<Button
            key="buttonDelete"
            bsSize="small"
            onClick={this.handleRemove.bind(this)}>
            <Glyphicon glyph="remove"/>
        </Button>);

        return (
            <FullscreenWidgetPanelUI
                title={this.props.title}
                components={c}
                widget={!this.state.descriptorContent ?
                    <div style={{textAlign: "center", verticalAlign: "center"}}>
                        No Dataset Descriptor Selected
                    </div> : this.props.widget(this.state.descriptorContent)}/>);
    };
}

export default LoadingWrapper(WidgetPanel, {maskClass: 'mask-container'})