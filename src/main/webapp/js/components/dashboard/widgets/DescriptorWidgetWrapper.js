'use strict';

import React from "react";
import {Button} from "react-bootstrap";

import Actions from "../../../actions/Actions";
import PropTypes from "prop-types";
import DatasetSourceStore from "../../../stores/DatasetSourceStore";

export default function DescriptorWidgetWrapper(Widget,datasetDescriptorTypeIri) {

    class DescriptorWidget extends React.Component {

        constructor(props){
            super(props)
            this.state={
                descriptorTypeIri : datasetDescriptorTypeIri
            };
        }

        componentWillMount() {
            this.unsubscribe = DatasetSourceStore.listen(this._onDescriptorsLoaded.bind(this));
        };

        componentWillUnmount() {
            this.unsubscribe();
        };

        _onDescriptorsLoaded = (data) => {
            if (data.action === Actions.selectDatasetSource) {
                this.props.loadingOn();
                // TODO all descriptors
                Actions.getDescriptorForLastSnapshotOfDatasetSource(
                    data.datasetSource.hash,
                    this.state.descriptorTypeIri);
            } else {
                if (data.descriptorTypeId == this.state.descriptorTypeIri) {
                    this.props.loadingOff();
                    this.setState({
                            datasetSource: DatasetSourceStore.getSelectedDatasetSource(),
                            descriptorContent: data.jsonLD,
                        }
                    );
                }
            }
        };

        render() {
            // Filter out extra props that are specific to this HOC and shouldn't be
            // passed through
            if (!this.state.datasetSource) {
                return <div style={{textAlign: "center", verticalAlign: "center"}}>
                    No Descriptors Available.
                </div>;
            } else {
                return <div>
                    <Button onClick={(e) => {
                        Actions.computeDescriptorForDatasetSource(
                            this.state.datasetSource.hash,
                            this.state.descriptorTypeIri
                        );
                    }}>
                        Compute
                    </Button>
                    <Widget {...this.props}
                            datasetSource={this.state.datasetSource}
                            descriptorContent={this.state.descriptorContent}
                    />
                </div>;
            }
        };

    }

    DescriptorWidget.propTypes = {
        descriptorTypeIri : PropTypes.string
    };

    return DescriptorWidget
}