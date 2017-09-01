'use strict';

import React from "react";
import {Grid, Row, Col} from "react-bootstrap";
import DatasetSourceTree from "./DatasetSourceTree";
import DatasetDashboard from "./DatasetDashboard";
import DatasetSourceRegistration from "./DatasetSourceRegistration";
import NamespaceList from "./NamespaceList";

class DashboardController extends React.Component {
    render() {
        return (
            <Grid fluid={true}>
                <Row>
                    <Col xs={6} md={4}>
                        <div><DatasetSourceRegistration/></div>
                        <div><NamespaceList/></div>
                        <div><DatasetSourceTree/></div>
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
