'use strict';

import React from "react";
import {Button, FormControl} from "react-bootstrap";

import Actions from "../../../actions/Actions";
import PropTypes from "prop-types";
import DatasetSourceStore from "../../../stores/DatasetSourceStore";
import DatasetDescriptorStore from "../../../stores/DatasetDescriptorStore";

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
        };

        componentWillUnmount() {
            this.unsubscribe1();
            this.unsubscribe2();
        };

        _onDescriptorsLoaded = (data) => {
            if (data.action === Actions.selectDatasetSource) {
                this.props.loadingOn();
                Actions.getDescriptorsForDatasetSource(
                    data.datasetSource.id,
                    this.state.descriptorTypeIri);
                this.setState({
                    datasetSource: DatasetSourceStore.getSelectedDatasetSource(),
                    descriptorContent: null
                });
            } else if (data.action === Actions.getDescriptorsForDatasetSource) {
                this.props.loadingOn();
                if (data.descriptorTypeId == this.state.descriptorTypeIri) {
                    this.props.loadingOff();
                    const state = {
                        descriptors: data.descriptors,
                        descriptorContent: null
                    }
                    if ( data.descriptors && data.descriptors[0] ) {
                        const id = data.descriptors[0].id;
                        Actions.getDescriptorContent(id, this.state.descriptorQuery);
                        state.selectedDescriptorId = id;
                    }
                    this.setState(state);
                }
            } else if (data.action === Actions.getDescriptorContent) {
                this.props.loadingOn();
                if (data.descriptorId == this.state.selectedDescriptorId) {
                    this.props.loadingOff();

                    this.setState({
                        descriptorId : data.descriptorId,
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

        render() {
            // Filter out extra props that are specific to this HOC and shouldn't be
            // passed through
            const descriptors = [];
            this.state.descriptors.forEach((d) => {
                descriptors.push(<option value={d.id} key={d.id}>{d.id}</option>);
            });

            return <div>
                <Button onClick={(e) => {
                    Actions.computeDescriptorForDatasetSource(
                        this.state.datasetSource.id,
                        this.state.descriptorTypeIri
                    );
                }}>
                    Compute
                </Button>
                <FormControl
                    componentClass="select"
                    placeholder="No descriptor selected"
                    onChange={this.handleChange.bind(this)}>
                    {descriptors}
                </FormControl>
                {
                    (!this.state.descriptorContent) ? <div style={{textAlign: "center", verticalAlign: "center"}}>
                        No Dataset Descriptor Selected
                    </div> :
                        <Widget {...this.props}
                                datasetSource={this.state.datasetSource}
                                descriptorContent={this.state.descriptorContent}
                        />
                }
            </div>;
        };

    }

    DescriptorWidget.propTypes = {
        descriptorTypeIri: PropTypes.string
    };

    return DescriptorWidget
}