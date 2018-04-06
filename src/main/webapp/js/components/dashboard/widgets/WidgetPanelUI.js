'use strict';

import React from "react";
import {ButtonToolbar, Col, Panel, Row} from "react-bootstrap";

export default class WidgetPanelUI extends React.Component {
    render() {
        let components = [];

        if (this.props.components) {
            this.props.components.forEach((c) => {
                components.push(c);
            });
        }

        let panelHeader = (
            <Row>
                <Col xs={4}><h4>{this.props.title}</h4></Col>
                <Col xs={8}>
                    <ButtonToolbar className="pull-right">
                        {components}
                    </ButtonToolbar>
                </Col>
            </Row>
        );

        return (
            <Panel>
                <Panel.Heading>{panelHeader}</Panel.Heading>
                <Panel.Body>{this.props.widget}</Panel.Body>
            </Panel>);
    };
}