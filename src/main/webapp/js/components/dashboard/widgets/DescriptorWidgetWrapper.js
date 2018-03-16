'use strict';

import React from "react";

import Actions from "../../../actions/Actions";
import PropTypes from "prop-types";
import DatasetSourceStore from "../../../stores/DatasetSourceStore";
import DatasetDescriptorStore from "../../../stores/DatasetDescriptorStore";
import DescriptorWidgetWrapperUI from "./DescriptorWidgetWrapperUI";

export default function DescriptorWidgetWrapper(Widget, datasetDescriptorTypeIri, descriptorQuery) {

    class DescriptorWidget extends React.Component {

        constructor(props) {
            super(props)
            this.state = {
                descriptorTypeIri: datasetDescriptorTypeIri,
                descriptorQuery: descriptorQuery,
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

        handleChange(event) {
            const id = event.target.value;
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
            return <DescriptorWidgetWrapperUI
                datasetSource={this.state.datasetSource}
                descriptorContent={this.state.descriptorContent}
                descriptors={this.state.descriptors}
                handleChangeDescriptor={this.handleChange.bind(this)}
                handleComputeDescriptor={this.handleClick.bind(this)}
                wrappedComponent={Widget}
            />
        };

    }

    DescriptorWidget.propTypes = {
        descriptorTypeIri: PropTypes.string
    };

    return DescriptorWidget
}