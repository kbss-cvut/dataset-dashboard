'use strict';

import React from "react";
import DatasetSourceStore from "../../../../stores/DatasetSourceStore";
import Actions from "../../../../actions/Actions";
import {TreeNode} from "rc-tree";
import LoadingWrapper from "../../../misc/LoadingWrapper";
import {Badge} from "react-bootstrap";

class SkosWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            lst: [],
            tree: [],
            loadedQueries: []
        }
    };

    componentWillMount() {
        this.unsubscribe = DatasetSourceStore.listen(this._onDataLoaded.bind(this));
    };

    //
    // renderTree(data, current, parentMap) {
    //     const current = item
    //
    //     let label = item['http://www.w3.org/2000/01/rdf-schema#label'];
    //     if (label["@language"]) {
    //         label = label["@value"] + ' (' + label["@language"] + ')';
    //     }
    //
    //     const children = {};
    //     if (current.narrower) {
    //         children
    //     }
    //
    //     return <TreeNode key={item['@id']}
    //                         title={label}>
    //         {children}
    //     </TreeNode>;
    // };

    _onDataLoaded = (data) => {
        if (data === undefined) {
            return
        }

        const queryHierarchy = "skos_widget/get_concept_hierarchy";
        const queryType = "skos_widget/get_vocabulary_type";

        if (data.action === Actions.selectDatasetSource) {
            this.setState({loadedQueries: []})
            this.props.loadingOn();
            Actions.executeQueryForDatasetSource(data.datasetSource.hash, queryHierarchy);
            Actions.executeQueryForDatasetSource(data.datasetSource.hash, queryType);
        } else {
            let lq = this.state.loadedQueries;
            if (data.queryName === queryHierarchy) {
                let lst = [];

                data.jsonLD.forEach((item) => {
                    lst.push(item);
                });

                lq.push(queryHierarchy);
                this.setState({
                    lst: lst,
                });
            } else if (data.queryName === queryType) {
                lq.push(queryType);
                this.setState({
                    type: data.jsonLD,
                });
            }
            if (lq.length >= 2) {
                this.props.loadingOff();
            }
            this.setState({
                loadedQueries: lq,
            });
        }
    };

    componentWillUnmount() {
        this.unsubscribe();
    };

    render() {
        var list = []
        if (this.state.lst) {
            list = this.state.lst.map((item) => {
                let label = item['http://www.w3.org/2000/01/rdf-schema#label'];
                if (label.length > 0) {
                    label = label[0];
                }
                if (label["@language"]) {
                    label = label["@value"] + ' (' + label["@language"] + ')';
                } else if (label["@value"]) {
                    label = label["@value"];
                } else if (label["@id"]) {
                    label = label["@id"];
                }
                return ( <li key={item['@id']}><a href={item['@id']}>{label}</a></li> );
            });
        }
        let type = 'unknown';
        if (this.state.type && this.state.type[0]) {
            type = this.state.type[0]['@id'];
        }
        return ( <div><Badge bsClass="badge badge-info">{type}</Badge>
            <ul>{list}</ul>
        </div> );
    };
}

//
// <Tree
//     className="myCls" showLine checkable defaultExpandAll
//     defaultExpandedKeys={this.state.defaultExpandedKeys}
//     onExpand={this.onExpand}
//     defaultSelectedKeys={this.state.defaultSelectedKeys}
//     defaultCheckedKeys={this.state.defaultCheckedKeys}
//     onSelect={this.onSelect} onCheck={this.onCheck}
// >
//     {this.state.tree}
// </Tree>

export default LoadingWrapper(SkosWidget, {maskClass: 'mask-container'});
