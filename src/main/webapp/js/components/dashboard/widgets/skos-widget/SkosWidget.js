'use strict';

import React from "react";
import DatasetSourceStore from "../../../../stores/DatasetSourceStore";
import Actions from "../../../../actions/Actions";
import {TreeNode} from "rc-tree";

class SkosWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            lst: [],
            tree: []
        }
    };

    componentWillMount() {
        this.unsubscribe = DatasetSourceStore.listen(this._onDataLoaded);
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
            Actions.executeQueryForDatasetSource(data.datasetSource.hash, queryHierarchy);
            Actions.executeQueryForDatasetSource(data.datasetSource.hash, queryType);
        } else if (data.queryName === queryHierarchy) {
            let lst = [];

            if (data.jsonLD['@graph']) {
                data.jsonLD['@graph'].forEach((item) => {
                    lst.push(item);
                });
            }

            this.setState({
                data: JSON.stringify(data.jsonLD),
                lst: lst
            });
        } else if (data.queryName === queryType) {
            this.setState({
                type: JSON.stringify(data.jsonLD)
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
                if (label["@language"]) {
                    label = label["@value"] + ' (' + label["@language"] + ')';
                } else if (label["@value"]) {
                    label = label["@value"];
                } else if (label["@id"]) {
                    label = label["@id"];
                }
                return ( <li key={item['@id']}><a href={label}>{label}</a></li> );
            });
        }
        var type = 'unknown'
        if (this.state.type) {
            type = this.state.type[0]['@id']
        }
        return ( <div><h4>{type}</h4>
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

export
default
SkosWidget;
