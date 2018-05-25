'use strict';

import * as React from "react";
import {Button,Glyphicon} from "react-bootstrap";
import * as PropTypes from "prop-types";

export default class FullscreenButton extends React.Component {
    render() {
        let icon;
        let title;
        if ( this.props.isFullscreen) {
            icon = "arrow-left"
            title= "Exit Fullscreen"
        } else {
            icon = "fullscreen"
            title= "Enter Fullscreen"
        }

        return (<Button
            key="btnFullscreen"
            bsSize="small"
            onClick={this.props.toggleFullscreen}
            title={title}>
            <Glyphicon glyph={icon}/>
        </Button>);
    };
}

FullscreenButton.propTypes = {
    isFullscreen: PropTypes.bool,
    toggleFullscreen: PropTypes.func,
};
