'use strict';

import React from "react";
import {Button, Col, FormControl, Grid, Row} from "react-bootstrap";

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
            <Grid fluid>
                <Row>
                    <Col xs={12} md={8} >
                        <FormControl
                            componentClass="select"
                            placeholder="No descriptor selected"
                            onChange={this.props.handleChangeDescriptor}>
                            {descriptors}
                        </FormControl>
                    </Col>
                    <Col><Button onClick={this.props.handleComputeDescriptor}>
                        Compute
                    </Button>
                    </Col>
                </Row></Grid>
                {!this.props.descriptorContent ?
                    <div style={{textAlign: "center", verticalAlign: "center"}}>
                        No Dataset Descriptor Selected
                    </div> : wrappedComponent}
        </div> : <div>No Dataset Source Selected.</div> }
        </div>;
    };
}