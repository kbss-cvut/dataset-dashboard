'use strict';

import React from "react";
import {Panel,Row,Col,Button,ButtonToolbar} from "react-bootstrap";
import Fullscreenable from "react-fullscreenable";

class WidgetPanelUI extends React.Component {
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

        buttons.push(<Button key="FULLSCREEN" onClick={toggleFullscreen}>{(isFullscreen) ? 'Exit Fullscreen' : 'Enter Fullscreen'}</Button>)

        let panelHeader = (
            <Row>
                <Col xs={8}><h3>{this.props.title}</h3></Col>
                <Col xs={4}>
                    <ButtonToolbar className="pull-right">
                        {buttons}
                    </ButtonToolbar>
                </Col>
            </Row>
        );

        return(
        <Panel header={panelHeader}>
            {this.props.widget}
        </Panel>);
    };
}

export default Fullscreenable()(WidgetPanelUI)