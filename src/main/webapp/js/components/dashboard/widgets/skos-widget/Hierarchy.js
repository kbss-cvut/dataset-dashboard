'use strict';

import React from "react";
import DatasetSourceStore from "../../../../stores/DatasetSourceStore";
import NamespaceStore from "../../../../stores/NamespaceStore";
import Actions from "../../../../actions/Actions";
import LoadingWrapper from "../../../misc/LoadingWrapper";
import {Badge} from "react-bootstrap";
import Tree, {TreeNode} from "rc-tree";
import ConceptScheme from "./model/ConceptScheme";
import Concept from "./model/Concept";

class Hierarchy extends React.Component {
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

    _onDataLoaded = (data) => {
        if (data === undefined) {
            return
        }

        const queryHierarchy = "skos/get_concept_hierarchy";

        if (data.action === Actions.selectDatasetSource) {
            this.setState({loadedQueries: []})
            this.props.loadingOn();
            Actions.executeQueryForDatasetSource(data.datasetSource.hash, queryHierarchy);
        } else {
            let lq = this.state.loadedQueries;
            if (data.queryName === queryHierarchy) {
                lq.push(queryHierarchy);
                this.setState({
                    tree: this.constructTree(data.jsonLD),
                });
            }
            this.props.loadingOff();
            this.setState({
                loadedQueries: lq,
            });
        }
    };

    componentWillUnmount() {
        this.unsubscribe();
    };

    constructTree(jsonLD) {
        let roots = [];
        let conceptSchemeIriToConceptsMap = {};
        let conceptIriToConceptMap = {};

        const skosPrefix = "http://www.w3.org/2004/02/skos/core#";
        const defaultConceptSchemeIri = "http://onto.fel.cvut.cz/ontologies/skos/concept-scheme/default";
        const defaultConceptScheme = new ConceptScheme(defaultConceptSchemeIri);

        if (jsonLD.length) {
            jsonLD.forEach((item) => {
                let type = item['@type'];
                if (type[0]) {
                    type = type[0];
                }
                if (type == skosPrefix + "ConceptScheme") {
                    roots.push(ConceptScheme.loadFromJsonLd(item));
                    // return this.renderConceptScheme(item)
                } else if (type == skosPrefix + "Concept") {
                    const concept = Concept.loadFromJsonLd(item);
                    conceptIriToConceptMap[concept.iri] = concept;

                    let conceptSchemeIri = concept.conceptSchemeIri;
                    if (!conceptSchemeIri) {
                        conceptSchemeIri = defaultConceptSchemeIri;
                        if (roots.indexOf(defaultConceptScheme) < 0) {
                            roots.push(defaultConceptScheme);
                        }
                    }
                    let concepts = conceptSchemeIriToConceptsMap[conceptSchemeIri];
                    if (!concepts) {
                        concepts = [];
                        conceptSchemeIriToConceptsMap[conceptSchemeIri] = concepts;
                    }
                    concepts.push(concept);
                }
            });

            roots.forEach((conceptScheme) => {
                if (!conceptScheme.children) {
                    conceptScheme.children = [];
                }
                const concepts = conceptSchemeIriToConceptsMap[conceptScheme.iri];
                concepts.forEach((concept) => {
                    if (!concept.children) {
                        concept.children = [];
                    }
                    concept.childrenIris.forEach((childIri) => {
                        concept.children.push(conceptIriToConceptMap[childIri])
                    });
                    conceptScheme.children.push(concept);
                });
            });
        }
        ;

        return roots;
    }

    _renderTree(current) {
        const children = current.children.map((child) => {
            return this._renderTree(child)
        });
        const label = NamespaceStore.getShortForm(current.labelMap ? current.labelMap["en"] : current.iri);
        if (!children || ( children.length == 0 )) {
            return (<TreeNode key={current.iri} title={label} disableCheckbox/> );

        } else {
            return (<TreeNode key={current.iri} title={label} disableCheckbox
                              isLeaf={!children || children.empty}>{children}</TreeNode> );
        }
    };

    render() {
        var list = []
        const children = this.state.tree.map((node) => {
            return this._renderTree(node);
        });
        return ( <Tree
            showLine
            showIcon={false}
            defaultExpandAll
            autoExpandParent={true}>
            {children}
        </Tree> );
    };
}

export default LoadingWrapper(Hierarchy, {maskClass: 'mask-container'});
