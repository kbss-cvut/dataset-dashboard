'use strict';

import React from "react";
import {Grid, Row, Col} from "react-bootstrap";
import DatasetSourceList from "./DatasetSourceList";
import DatasetDashboard from "./DatasetDashboard";

class DashboardController extends React.Component {
    render() {
        return (
            <Grid fluid={true}>
                <Row>
                    <Col xs={6} md={4}>
                        <DatasetSourceList/>
                    </Col>
                    <Col xs={12} md={8}>
                        <DatasetDashboard/>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default DashboardController;
