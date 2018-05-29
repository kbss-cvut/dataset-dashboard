'use strict';

import * as React from "react";
import {Button, Glyphicon} from "react-bootstrap";

interface Props {
    isFullscreen: boolean,
    toggleFullscreen: () => void
};

export const FullscreenButton: React.SFC<Props> = props => {
    let icon;
    let title;
    if (props.isFullscreen) {
        icon = "arrow-left"
        title = "Exit Fullscreen"
    } else {
        icon = "fullscreen"
        title = "Enter Fullscreen"
    }

    return (<Button
        key="btnFullscreen"
        bsSize="small"
        onClick={props.toggleFullscreen}
        title={title}>
        <Glyphicon glyph={icon}/>
    </Button>);
}
