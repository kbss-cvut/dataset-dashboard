'use strict';

import React from "react";
import DatasetSourceStore from "../../../../stores/DatasetSourceStore";
import Actions from "../../../../actions/Actions";
import {TreeNode} from "rc-tree";
import LoadingWrapper from "../../../misc/LoadingWrapper";

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
            this.setState({loadedQueries:[]})
            this.props.loadingOn();
            Actions.executeQueryForDatasetSource(data.datasetSource.hash, queryHierarchy);
            Actions.executeQueryForDatasetSource(data.datasetSource.hash, queryType);
        } else if (data.queryName === queryHierarchy) {
            let lst = [];

            if (data.jsonLD['@graph']) {
                data.jsonLD['@graph'].forEach((item) => {
                    lst.push(item);
                });
            } else {
                data.jsonLD.forEach((item) => {
                    lst.push(item);
                });
            }

            let lq = this.state.loadedQueries;
            lq.push(queryHierarchy);
            this.setState({
                data: JSON.stringify(data.jsonLD),
                lst: lst,
                loadedQueries: lq
            });
        } else if (data.queryName === queryType) {
            let lq = this.state.loadedQueries;
            lq.push(queryType);
            this.setState({
                type: data.jsonLD,
                loadedQueries: lq
            });
        }
        if (this.state.loadedQueries.length == 2) {
            this.props.loadingOff();
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
                if ( label.length > 0 ) {
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
        var type = 'unknown'
        if (this.state.type && this.state.type[0]) {
            type = this.state.type[0]['@id'];
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
default LoadingWrapper(SkosWidget, {maskClass: 'mask-container'});
