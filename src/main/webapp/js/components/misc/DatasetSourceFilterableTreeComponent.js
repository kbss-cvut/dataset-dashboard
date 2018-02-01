'use strict';

import React from "react";
import {FormControl} from "react-bootstrap";
import DatasetSourceTreeComponent from "./DatasetSourceTreeComponent";

export default class DatasetSourceFilterableTreeComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            /**
             * Value of the filter text field
             */
            inputValue: ''
        };
    };

    filterFn(key) {
        if (!this.state.inputValue || key.indexOf(this.state.inputValue) > -1) {
            return true;
        }

        return false;
    }

    filterTreeNode(tree, node) {
        return this.state.inputValue && this.filterFn(node.props.eventKey);
    }

    onChange(e) {
        this.setState({
            inputValue: e.target.value
        });
    }

    render() {
        return (<div>
            <FormControl
                type="text"
                value={this.state.inputValue}
                placeholder="Filter ..."
                onChange={(e) => this.onChange(e)}
            />
            <DatasetSourceTreeComponent {...this.props}
                   filterTreeNode={(tree, node) => this.filterTreeNode(this,tree, node)}
                   filterFn={(key) => this.filterFn(key)}
            />
        </div>)
    }
}
