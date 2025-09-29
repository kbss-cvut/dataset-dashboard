'use strict';

import * as React from "react";
import {FormControl} from "react-bootstrap";
import Tree, {SHOW_PARENT, TreeNode} from "rc-tree";
import {Scrollbars} from "react-custom-scrollbars";

// TODO
//import DatasetSource from "../../model/DatasetSource";

interface Props {
    selectable: boolean,
    treeCheckable: boolean,
    showIcon: boolean,
    height: number,
    width: number,
    createView: (item: any) => React.Component,
    createKey: (item: any) => string,
    data: object[]
}

interface State {
    tree: object[],
    inputValue: string,
}

export default class DatasetSourceFilterableTreeComponent extends React.Component<Props,State> {

    constructor(props:any) {
        super(props);
        this.state = {
            /**
             * Value of the filter text field
             */
            inputValue: '',
            /**
             * Actual tree.
             */
            tree : props.data
        };
    };

    traverseTree(nodes: any[], childFn: any, nodeFn:any) {
        nodes.forEach((node) => {
           nodeFn(node);
           this.traverseTree(childFn(node), childFn, nodeFn);
        });
    }

    filterFn(key:string, curValue:string) {
        return key.indexOf(curValue) > -1;
    }

    onChange(e:React.ChangeEvent<any>) {
        const oldInputValue = this.state.inputValue;
        const curInputValue = e.target.value;
        const state : State = { inputValue : curInputValue, tree: [] };

        let tree;
        if ( curInputValue.indexOf(oldInputValue) > -1) {
            tree = this.state.tree;
        } else {
            tree = this.props.data;
        }

        state.tree = this.filterTree(tree,curInputValue).data
        this.setState(state);
    }

    filterTree(data:any, curInputValue:any) {
        let c = false;
        let nodes:any[] = [];
        data.forEach((item:any) => {
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

    createNode(item:any) {
        const parts = item.filteredParts ? item.filteredParts : item.parts;
        return <TreeNode
            key={this.props.createKey(item)}
            title={this.props.createView(item)}
            isLeaf={parts.length == 0}>{parts.length > 0 ? parts.map((child:any) => this.createNode(child)) : null}
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
                    filterTreeNode={(node:any) =>
                        this.filterFn(node.props.eventKey,this.state.inputValue)}
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
