'use strict';

import React from "react";
import DatasetSourceStore from "../../../../stores/DatasetSourceStore";
import NamespaceStore from "../../../../stores/NamespaceStore";
import Actions from "../../../../actions/Actions";
import LoadingWrapper from "../../../misc/LoadingWrapper";
import {Badge,Button} from "react-bootstrap";
import Tree, {TreeNode} from "rc-tree";
import Vocabulary from "./model/Vocabulary";
import Concept from "./model/Concept";

class Hierarchy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tree: [],
            iriToVocabularyMap: {},
            vocabularyIriActiveMap: {}
        }
    };

    componentWillMount() {
        this.unsubscribe = DatasetSourceStore.listen(this._onDataLoaded.bind(this));
    };

    _onDataLoaded = (data) => {
        if (data === undefined) {
            return
        }

        const queryHierarchy = "vocabulary/skos/get_concept_hierarchy";
        const queryHierarchy2 = "vocabulary/owl/get_hierarchy";

        if (data.action === Actions.selectDatasetSource) {
            this.setState({loadedQueries: [], iriToVocabularyMap: {}, vocabularyIriActiveMap: {}})
            this.props.loadingOn();
            Actions.executeQueryForDatasetSource(data.datasetSource.hash, queryHierarchy);
            Actions.executeQueryForDatasetSource(data.datasetSource.hash, queryHierarchy2);
        } else {
            if (data.queryName === queryHierarchy) {
                this.constructSkosTree(data.jsonLD)
            } else if (data.queryName === queryHierarchy2) {
                this.constructOwlTree(data.jsonLD)
            }
            this.props.loadingOff();
        }
    };

    componentWillUnmount() {
        this.unsubscribe();
    };

    createDefaultVocabulary(defaultVocabularyIri, parentIri) {
        const defaultVocabulary = new Vocabulary(defaultVocabularyIri);
        defaultVocabulary.children = [];
        defaultVocabulary.parentIri = parentIri;
        return defaultVocabulary;
    }

    createActiveMap(iriToVocabularyMap) {
        const vocabularyIriActiveMap = {};
        Object.keys(iriToVocabularyMap).forEach((iri)=>{
            vocabularyIriActiveMap[iri] = true;
        });
        return vocabularyIriActiveMap;
    }

    constructSkosTree(jsonLD) {
        let conceptSchemes = [];
        let conceptSchemeIriToConceptsMap = {};
        let conceptIriToConceptMap = {};
        let roots = this.state.tree;

        const skosPrefix = "http://www.w3.org/2004/02/skos/core#";
        const defaultVocabulary = this.createDefaultVocabulary("http://onto.fel.cvut.cz/ontologies/vocabulary/skos/default",
        skosPrefix);
        const iriToVocabularyMap = this.state.iriToVocabularyMap;
        iriToVocabularyMap[defaultVocabulary.iri] = defaultVocabulary;

        // if (conceptSchemes.indexOf(defaultVocabulary) < 0) {
        conceptSchemes.push(defaultVocabulary);
        conceptSchemeIriToConceptsMap[defaultVocabulary.iri]=[];
        // }

        if (jsonLD.length) {
            jsonLD.forEach((item) => {
                let type = item['@type'];
                if (type && type[0]) {
                    type = type[0];
                }
                if (type == skosPrefix + "ConceptScheme") {
                    const vocabulary = Vocabulary.loadFromJsonLd(item)
                    vocabulary.parentIri = skosPrefix;
                    conceptSchemes.push(vocabulary);
                    // return this.renderConceptScheme(item)
                } else if (type == skosPrefix + "Concept") {
                    const concept = Concept.loadFromJsonLd(item, skosPrefix + "broader");
                    concept.children=[];
                    conceptIriToConceptMap[concept.iri] = concept;

                    const conceptSchemeIris = item[skosPrefix + "inScheme"];
                    let conceptSchemeIri = null;
                    if (conceptSchemeIris) {
                        conceptSchemeIri = conceptSchemeIris[0]['@id'];
                    } else {
                        conceptSchemeIri = defaultVocabulary.iri;
                    }
                    let concepts = conceptSchemeIriToConceptsMap[conceptSchemeIri];
                    if (!concepts) {
                        concepts = [];
                        conceptSchemeIriToConceptsMap[conceptSchemeIri] = concepts;
                    }
                    concepts.push(concept);
                }
            });
            conceptSchemes.forEach((conceptScheme) => {
                conceptScheme.childrenIris = [];
                const concepts = conceptSchemeIriToConceptsMap[conceptScheme.iri];
                concepts.forEach((concept) => {
                    if (concept.parentIri && concept.parentIri != null) {
                        conceptIriToConceptMap[concept.parentIri].children.push(concept);
                    }
                    conceptScheme.childrenIris.push(concept.iri);
                    roots.push(concept);
                });
                iriToVocabularyMap[conceptScheme.iri] = conceptScheme;
            });
        }

        this.setState({
            tree: roots,
            iriToVocabularyMap: iriToVocabularyMap,
            vocabularyIriActiveMap: this.createActiveMap(iriToVocabularyMap)
        });
    }

    constructOwlTree(jsonLD) {
        let roots = this.state.tree;
        let conceptIriToConceptMap = {};

        const owlPrefix = "http://www.w3.org/2002/07/owl#";
        const rdfsPrefix = "http://www.w3.org/2000/01/rdf-schema#";

        const defaultVocabulary = this.createDefaultVocabulary("http://onto.fel.cvut.cz/ontologies/vocabulary/owl/default",owlPrefix);
        defaultVocabulary.childrenIris = [];

        const iriToVocabularyMap = this.state.iriToVocabularyMap;
        iriToVocabularyMap[defaultVocabulary.iri] = defaultVocabulary;

        if (jsonLD.length) {
            jsonLD.forEach((item) => {
                let type = item['@type'];
                if (type && type[0]) {
                    type = type[0];
                }
                if (type == owlPrefix + "Class") {
                    const concept = Concept.loadFromJsonLd(item, rdfsPrefix + "subClassOf");
                    conceptIriToConceptMap[concept.iri] = concept;
                    concept.children=[];
                }
            });
            Object.values(conceptIriToConceptMap).forEach((concept) => {
                if (concept.parentIri && concept.parentIri != null) {
                    conceptIriToConceptMap[concept.parentIri].children.push(concept);
                } else {
                    roots.push(concept);
                    defaultVocabulary.childrenIris.push(concept.iri);
                }
            });
        }

        this.setState({
            tree: roots,
            iriToVocabularyMap: iriToVocabularyMap,
            vocabularyIriActiveMap: this.createActiveMap(iriToVocabularyMap)
        });
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

    onVocabularySelect(iri) {
        const l = this.state.vocabularyIriActiveMap;
        Object.keys(l).filter((vocabulary) => {
            return vocabulary == iri}).
        forEach((vocabulary) => {
            if ( !l[vocabulary]) {
                l[vocabulary] = false;
            }
            l[vocabulary] = !l[vocabulary];
        })
        this.setState({
            vocabularies: l
        });
    };

    render() {
        const topVocabularies = this.props.vocabularies;
        const iriToVocabularyMap = this.state.iriToVocabularyMap;
        let vocabularyIriActiveMap = this.state.vocabularyIriActiveMap;
        const subVocabularyIris = Object.keys(iriToVocabularyMap).filter((vocabularyIri)=> {
            return (topVocabularies.indexOf(iriToVocabularyMap[vocabularyIri].parentIri) > -1);
        });
        Object.keys(vocabularyIriActiveMap).forEach((vocabularyIri)=> {
            if ( subVocabularyIris.indexOf(vocabularyIri) < 0 ) {
                vocabularyIriActiveMap[vocabularyIri] = false;
            }
        });
        const rootsWithActiveVocabularies = this.state.tree.filter((node) => {
            return (Object.keys(iriToVocabularyMap).filter((vocabularyIri) => {
                const active = vocabularyIriActiveMap[vocabularyIri]
                return active && iriToVocabularyMap[vocabularyIri].childrenIris.indexOf(node.iri) > -1}).length > 0);
        });
        const children = rootsWithActiveVocabularies.map((node) => { return this._renderTree(node); });
        const subVocabulariesComponents = subVocabularyIris.map((iri) => {
            return <Button key={iri} onClick={()=>{return this.onVocabularySelect(iri)}} active={vocabularyIriActiveMap[iri]}>
                {NamespaceStore.getShortForm(iri)}
            </Button>;
        });
        return (<div>
            {subVocabulariesComponents}
            <Tree
                showLine
                showIcon={false}
                defaultExpandAll
                autoExpandParent={true}>
                {children}
            </Tree>
        </div>);
    };
}

export default LoadingWrapper(Hierarchy, {maskClass: 'mask-container'});
