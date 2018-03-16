'use strict';

import React from "react";
import {Panel,Row,Col,Button,ButtonToolbar,Glyphicon} from "react-bootstrap";
import Fullscreenable from "react-fullscreenable";

export default class FullScreenButton extends React.Component {
    render() {
        let icon;
        let title;
        if ( this.props.isFullscreen) {
            icon = "arrow-left"
            title= "Exit XFullscreen"
        } else {
            icon = "fullscreen"
            title= "Enter YFullscreen"
        }

        return (<Button key="FULLSCREEN" onClick={this.props.toggleFullscreen} title={title}><Glyphicon glyph={icon}/></Button>);
    };
}