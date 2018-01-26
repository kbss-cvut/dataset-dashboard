'use strict';

import React from "react";
import {Button, FormControl} from "react-bootstrap";

export default class DescriptorWidgetWrapperUI extends React.Component {
    render() {
        const descriptors = [];
        this.props.descriptors.forEach((d) => {
            descriptors.push(<option value={d.id} key={d.id}>{d.id}</option>);
        });

        const wrappedComponent = <this.props.wrappedComponent {...this.props}
                                                              datasetSource={this.props.datasetSource}
                                                              descriptorContent={this.props.descriptorContent}
        />

        return <div> {this.props.datasetSource ? <div>
            <FormControl
                componentClass="select"
                placeholder="No descriptor selected"
                onChange={this.props.handleChangeDescriptor}>
                {descriptors}
            </FormControl>
            <Button onClick={this.props.handleComputeDescriptor}>
                Compute
            </Button>
            {!this.props.descriptorContent ?
                <div style={{textAlign: "center", verticalAlign: "center"}}>
                    No Dataset Descriptor Selected
                </div>
                :
                wrappedComponent}
        </div> : <div>No Dataset Source Selected.</div> }
        </div>;
    };
}