'use strict';

import * as React from "react";
import Fullscreenable from "react-fullscreenable";
import {FullscreenButton} from "./FullscreenButton";
import {WidgetPanelUI} from "./WidgetPanelUI";

interface Props {
    title: string,
    widget: React.Component,
    components: object[],
    isFullscreen: boolean,
    toggleFullscreen: () => void
}

const FullscreenWidgetPanelUI: React.SFC<Props> = props => {
    let components;
    if (props.components) {
        components = [].concat(props.components);
    } else {
        components = []
    }
    components.push(<FullscreenButton key="btnFullscreen"
                                      isFullscreen={props.isFullscreen}
                                      toggleFullscreen={props.toggleFullscreen}/>);
    return (
        <WidgetPanelUI
            title={props.title}
            components={components}
            widget={props.widget}/>);
}

export default Fullscreenable()(FullscreenWidgetPanelUI)