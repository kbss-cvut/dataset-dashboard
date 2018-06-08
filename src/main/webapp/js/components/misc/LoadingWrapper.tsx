'use strict';

import * as React from "react";
import {Mask} from "./Mask";

/**
 * Higher order component which provides loading mask facilities to the wrapped component.
 * @param Component The component to wrap
 * @param options Allows configuration of the wrapper component. Supported options are:
 * <ul>
 *     <li>tag - the tag to wrap the Component and the loading mask in, default is div,</li>
 *     <li>maskClass - class name to pass to the mask component.</li>
 * </ul>
 */
const LoadingWrapper = (Component, options) => {

    interface State {
        loading :boolean;
        msg :string;
    }

    return class Wrapped extends React.Component<{}, State> {
        displayName;
        wrappedComponent;
        _wrappedComponent;

        constructor(props) {
            super(props);
            this.state = {
                loading: false,
                msg: undefined
            };
            this.displayName = "LoadingWrapper(" + Component + ")";
            this.wrappedComponent = Component.wrappedComponent ? Component.wrappedComponent : Component;
        }

        getWrappedComponent() {
            // Enable composition of multiple HOCs.
            return this._wrappedComponent && this._wrappedComponent.getWrappedComponent ?
                this._wrappedComponent.getWrappedComponent() : this._wrappedComponent;
        }

        loadingOn = (msg) => {
            this.setState({loading: true, msg: msg});
        };

        loadingOff = () => {
            this.setState({loading: false, msg: undefined});
        };

        render() {
            const tag = options && options.tag ? options.tag : 'div',
                maskClass = options && options.maskClass ? options.maskClass : null;
            return React.createElement(tag, {className: 'relative'},
                this.state.loading && <Mask text={this.state.msg} classes={maskClass}/>,
                <Component ref={(c) => this._wrappedComponent = c} loadingOn={this.loadingOn}
                           loadingOff={this.loadingOff} {...this.props}/>
            );
        }
    }
};

export default LoadingWrapper;
