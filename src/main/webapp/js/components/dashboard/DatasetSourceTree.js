'use strict';

import React from "react";
import DatasetSourceStore from "../../stores/DatasetSourceStore";
import Actions from "../../actions/Actions";
import {FormControl, Panel, Grid, Row, Col} from "react-bootstrap";
import LoadingWrapper from "../misc/LoadingWrapper";
import Tree, {SHOW_PARENT, TreeNode} from "rc-tree";
import DatasetSourceLink from "./DatasetSourceLink";
import ScrollArea from "react-scrollbar";

class DatasetSourceTree extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            datasetSources: [],
            inputValue: '',
            sel: '',
            expandedKeys: [],
            autoExpandParent: true,
        };
    };

    componentWillMount() {
        this.props.loadingOn();
        Actions.getAllDatasetSources();
        this.unsubscribe = DatasetSourceStore.listen(this._onDataLoaded);
    };

    _onDataLoaded = (data) => {
        if (data === undefined) {
            return
        }

        if (data.action == Actions.getAllDatasetSources) {
            this.props.loadingOff();
            this.setState({
                datasetSources: data.datasetSources,
            });
        }
    };

    componentWillUnmount() {
        this.unsubscribe();
    };


    // filterTreeNode(dsTree,treeNode) {
    //     if (this.state.inputValue && treeNode.props.eventKey.match(".*"+this.state.inputValue+".*")) {
    //         console.log("TRUE")
    //         return true;
    //     }
    //     console.log("FALSE")
    //     return false;
    // };

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
        this.filterKeys = [];
        this.setState({
            inputValue: e.target.value
        });
    }

    render() {
        const loop = data => {
            let c = false;
            let nodes = [];
            data.forEach((item) => {
                const key = item.endpointUrl + " " + item.graphId;
                const title = <DatasetSourceLink datasetSource={item}/>;
                let currentC = false;
                if (this.filterFn(key)) {
                    currentC = true;
                }
                let parts = [];
                if (item.parts) {
                    let result = loop(item.parts);
                    currentC = currentC || result.childMatch;
                    parts = result.data;
                }
                c = c || currentC;
                if (currentC) {
                    if (parts.length > 0) {
                        nodes.push(
                            <TreeNode
                                key={key}
                                title={title}
                                isLeaf={parts.length == 0}>{parts}
                            </TreeNode>);
                    } else {
                        nodes.push(<TreeNode
                            key={key}
                            title={title}
                            isLeaf={true}
                        />);
                    }
                }
            });
            return {childMatch: c, data: nodes};
        };

        let tree = loop(this.state.datasetSources).data;
        console.log(tree.length);

        return (<Panel header="Filter Dataset Source">
            <Grid>
                <Row>
                    <Col xs={3} md={3}>
                        <FormControl
                            type="text"
                            value={this.state.inputValue}
                            placeholder="Filter ..."
                            onChange={(e) => this.onChange(e)}
                        />
                    </Col>
                    <Col xs={1} md={1}>
                        <div>{this.state.inputValue ? ("("+tree.length)+")" : ""}</div>
                    </Col>
                </Row>
            </Grid>
            <div>
            <ScrollArea
                style={{height: 400}}
                speed={0.8}
                className="area"
                contentClassName="content"
                horizontal={false}
            >
            <Tree
                filterTreeNode={(tree, node) => this.filterTreeNode(this, tree, node)}
                selectable={false}
                expandable={true}
                notFoundContent="No data receivedX."
                showIcon={false}
                treeCheckable={false}>
                {tree}
            </Tree>
            </ScrollArea>
            </div>
        </Panel>)

    }
}
export default LoadingWrapper(DatasetSourceTree, {maskClass: 'mask-container'});
