'use strict';

import React from "react";
import {Panel,Row,Col,Button,ButtonToolbar,Glyphicon} from "react-bootstrap";
import Fullscreenable from "react-fullscreenable";

class WidgetPanelUI extends React.Component {

    getFullScreenButton(isFullscreen, toggleFullscreen) {
        let icon;
        let title;
        if ( isFullscreen) {
            icon = "arrow-left"
            title= "Exit Fullscreen"
        } else {
            icon = "fullscreen"
            title= "Enter Fullscreen"
        }

        return (<Button key="FULLSCREEN" onClick={toggleFullscreen} title={title}><Glyphicon glyph={icon}/></Button>);

    };

    render() {
        const {
            isFullscreen,
            toggleFullscreen
        } = this.props;

        let buttons = [];

        if ( this.props.actions ) {
            this.props.actions.each((a) => {
                buttons.push(<Button key={a.name} onClick={a.execute} icon={a.icon} tooltip={a.name}>{a.name}</Button>);
            });
        }

        buttons.push(this.getFullScreenButton(isFullscreen,toggleFullscreen));

        let panelHeader = (
            <Row>
                <Col xs={4}><h4>{this.props.title}</h4></Col>
                <Col xs={8}>
                    <ButtonToolbar className="pull-right">
                        {buttons}
                    </ButtonToolbar>
                </Col>
            </Row>
        );

        return(
        <Panel header={panelHeader}>
            {this.props.widget(isFullscreen)}
        </Panel>);
    };
}

export default Fullscreenable()(WidgetPanelUI)