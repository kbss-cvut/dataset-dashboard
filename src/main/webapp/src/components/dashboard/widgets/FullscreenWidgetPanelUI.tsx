'use strict';

import * as React from "react";
import Fullscreenable from "react-fullscreenable";
import {FullscreenButton} from "./FullscreenButton";
import {WidgetPanelUI} from "./WidgetPanelUI";

interface Props {
    title: string,
    widget: React.ReactNode,
    components: React.ReactNode[],
    isFullscreen: boolean,
    toggleFullscreen: () => void
}

const FullscreenWidgetPanelUI: React.FC<Props> = props => {
    let components: React.ReactNode[];
    if (props.components) {
        components = [...props.components];
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