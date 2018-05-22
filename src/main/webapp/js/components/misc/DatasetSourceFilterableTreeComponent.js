'use strict';

import React from "react";
import {FormControl} from "react-bootstrap";
import Tree, {SHOW_PARENT, TreeNode} from "rc-tree";
import {Scrollbars} from "react-custom-scrollbars";

export default class DatasetSourceFilterableTreeComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            /**
             * Value of the filter text field
             */
            inputValue: '',
            /**
             * Actual tree.
             */
            tree : []
        };
    };

    componentDidMount() {
        this.state.tree = this.props.data;
    }

    traverseTree(nodes, childFn, nodeFn) {
        nodes.forEach((node) => {
           nodeFn(node);
           this.traverseTree(childFn(node), childFn, nodeFn);
        });
    }

    filterFn(key, curValue) {
        return key.indexOf(curValue) > -1;
    }

    filterTreeNode(tree, node) {
        return this.filterFn(node.props.eventKey,this.state.inputValue);
    }

    onChange(e) {
        const oldInputValue = this.state.inputValue;
        const curInputValue = e.target.value;
        const state = {
            inputValue: curInputValue
        }

        let tree;
        if ( curInputValue.indexOf(oldInputValue) > -1) {
            tree = this.state.tree;
        } else {
            tree = this.props.data;
        }

        state.tree = this.filterTree(tree,curInputValue).data
        this.setState(state);
    }

    filterTree(data, curInputValue) {
        let c = false;
        let nodes = [];
        data.forEach((item) => {
            let currentC = this.filterFn(this.props.createKey(item),curInputValue);
            delete item.filteredParts;
            if (item.parts) {
                let result = this.filterTree(item.parts, curInputValue);
                currentC = currentC || result.childMatch;
                item.filteredParts = result.data;
            }
            if (currentC) {
                nodes.push(item);
            }
            c = c || currentC;
        });
        return {childMatch: c, data: nodes};
    }

    createNode(item) {
        const parts = item.filteredParts ? item.filteredParts : item.parts;
        return <TreeNode
            key={this.props.createKey(item)}
            title={this.props.createView(item)}
            isLeaf={parts.length == 0}>{parts.length > 0 ? parts.map((child) => this.createNode(child)) : null}
        </TreeNode>
    }

    render() {
        const tree = this.state.tree.map((node) => this.createNode(node));
        return (<div>
            <FormControl
                type="text"
                value={this.state.inputValue}
                placeholder="Filter ..."
                onChange={(e) => this.onChange(e)}
            />
            <Scrollbars style={{height: this.props.height, width: this.props.width}}>
                <Tree
                    style={{height: this.props.height, width: this.props.width}}
                    filterTreeNode={(tree, node) => this.filterTreeNode(this,tree, node)}
                    selectable={this.props.selectable}
                    autoExpandParent={true}
                    expandable={true}
                    notFoundContent="No data received."
                    showIcon={this.props.showIcon}
                    treeCheckable={this.props.treeCheckable}>
                    {tree}
                </Tree>
            </Scrollbars>
        </div>)
    }
}
