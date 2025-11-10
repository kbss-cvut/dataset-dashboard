'use strict';

import * as React from "react";
import {ButtonToolbar, Col, Panel, Row} from "react-bootstrap";

interface Props {
    components: React.ReactNode[],
    title: string,
    widget: React.ReactNode
}

export const WidgetPanelUI: React.FC<Props> = (props) => {
    let components: React.ReactNode[] = [];

    if (props.components) {
        props.components.forEach((c) => {
            components.push(c);
        });
    }

    return (
        <Panel>
            <Panel.Heading>
                <Row>
                    <Col xs={4}><h4>{props.title}</h4></Col>
                    <Col xs={8}>
                        <ButtonToolbar className="pull-right">
                            {components}
                        </ButtonToolbar>
                    </Col>
                </Row>
            </Panel.Heading>
            <Panel.Body>{props.widget}</Panel.Body>
        </Panel>);
}