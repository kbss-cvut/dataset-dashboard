'use strict';

import React from "react";
import Tree, {SHOW_PARENT, TreeNode} from "rc-tree";
import {Scrollbars} from "react-custom-scrollbars";

export default class DatasetSourceTreeComponent extends React.Component {

    constructTree(data) {
        let c = false;
        let nodes = [];
        data.forEach((item) => {
            const key = this.props.createKey(item);
            let currentC = this.props.filterFn(key);
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
        return (<Scrollbars style={{height: this.props.height, width: this.props.width}}>
                <Tree
                    style={{height: this.props.height, width: this.props.width}}
                    filterTreeNode={this.props.filterTreeNode}
                    selectable={this.props.selectable}
                    autoExpandParent={true}
                    expandable={true}
                    notFoundContent="No data received."
                    showIcon={this.props.showIcon}
                    treeCheckable={this.props.treeCheckable}>
                    {tree}
                </Tree>
            </Scrollbars>
        )
    }
}
