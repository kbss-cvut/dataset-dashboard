'use strict';

import React from "react";
import Fullscreenable from "react-fullscreenable";
import FullscreenButton from "./FullscreenButton";
import WidgetPanelUI from "./WidgetPanelUI";

class FullscreenWidgetPanelUI extends React.Component {
    render() {
        let components = []
        if (this.props.components) {
            components = [].concat(this.props.components);
        }
        const {
            isFullscreen,
            toggleFullscreen
        } = this.props;
        components.push(<FullscreenButton key="btnFullscreen"
                                          isFullscreen={isFullscreen}
                                          toggleFullscreen={toggleFullscreen}/>);
        return (
            <WidgetPanelUI
                title={this.props.title}
                components={components}
                widget={this.props.widget}/>);
    };
}

export default Fullscreenable()(FullscreenWidgetPanelUI)