'use strict';

import React from "react";
import {FormControl} from "react-bootstrap";
import Tree, {SHOW_PARENT, TreeNode} from "rc-tree";
import {Scrollbars} from "react-custom-scrollbars";

class FilterableTree extends React.Component {

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

    constructTree(data) {
        let c = false;
        let nodes = [];
        data.forEach((item) => {
            const key = this.props.createKey(item);
            let currentC = this.filterFn(key);
            let parts = [];
            if (item.parts) {
                let result = this.constructTree(item.parts);
                currentC = currentC || result.childMatch;
                parts = result.data;
            }
            if (currentC) {
                nodes.push(<TreeNode
                    key={key}
                    title={this.props.createView(item)}
                    isLeaf={parts.length == 0}>{parts.length > 0 ? parts : null}
                </TreeNode>);
            }
            c = c || currentC;
        });
        return {childMatch: c, data: nodes};
    }

    render() {
        let tree = this.constructTree(this.props.data).data;
        return (<div>
                <FormControl
                    type="text"
                    value={this.state.inputValue}
                    placeholder="Filter ..."
                    onChange={(e) => this.onChange(e)}
                />
                <div>
                    <Scrollbars style={{height: this.props.height}}>
                        <Tree
                            filterTreeNode={(tree, node) => this.filterTreeNode(this, tree, node)}
                            selectable={this.props.selectable}
                            autoExpandParent={true}
                            expandable={true}
                            notFoundContent="No data received."
                            showIcon={this.props.showIcon}
                            treeCheckable={this.props.treeCheckable}>
                            {tree}
                        </Tree>
                    </Scrollbars>
                </div>
            </div>
        )
    }
}
export default FilterableTree;
