'use strict';

import React from "react";
import {ButtonToolbar, Col, Panel, Row} from "react-bootstrap";
import Fullscreenable from "react-fullscreenable";
import FullScreenButton from "./FullScreenButton";

class WidgetPanelUI extends React.Component {
    render() {
        let components = [];

        if (this.props.components) {
            this.props.components.forEach((c) => {
                components.push(c);
            });
        }

        const {
            isFullscreen,
            toggleFullscreen
        } = this.props;
        components.push(<FullScreenButton key="fullscreen" isFullscreen={isFullscreen}
                                          toggleFullscreen={toggleFullscreen}/>);

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
            <Panel header={panelHeader}>
                {this.props.widget}
            </Panel>);
    };
}

export default Fullscreenable()(WidgetPanelUI)