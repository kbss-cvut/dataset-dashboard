'use strict';

import React from "react";
import DatasetSourceStore from "../../../../stores/DatasetSourceStore";
import NamespaceStore from "../../../../stores/NamespaceStore";
import Actions from "../../../../actions/Actions";
import LoadingWrapper from "../../../misc/LoadingWrapper";
import {Badge} from "react-bootstrap";
import Tree,{TreeNode} from "rc-tree";
import ConceptScheme from "./model/ConceptScheme";
import Concept from "./model/Concept";

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

    _onDataLoaded = (data) => {
        if (data === undefined) {
            return
        }

        const queryHierarchy = "skos/get_concept_hierarchy";
        const queryConceptSchemes = "skos/get_concept_schemes";
        const queryType = "skos/get_vocabulary_type";
        const queryLanguages = "skos/get_languages";

        if (data.action === Actions.selectDatasetSource) {
            this.setState({loadedQueries: []})
            this.props.loadingOn();
            Actions.executeQueryForDatasetSource(data.datasetSource.hash, queryHierarchy);
            Actions.executeQueryForDatasetSource(data.datasetSource.hash, queryConceptSchemes);
            Actions.executeQueryForDatasetSource(data.datasetSource.hash, queryLanguages);
            Actions.executeQueryForDatasetSource(data.datasetSource.hash, queryType);
        } else {
            let lq = this.state.loadedQueries;
            if (data.queryName === queryHierarchy) {
                lq.push(queryHierarchy);
                this.setState({
                    tree: this.constructTree(data.jsonLD),
                });
            } else if (data.queryName === queryType) {
                lq.push(queryType);
                this.setState({
                    type: data.jsonLD,
                });
            } else if (data.queryName === queryLanguages) {
                lq.push(queryLanguages);
                this.setState({
                    languages: data.jsonLD.map((item) => {
                        return item['@value']
                    }),
                });
            } else if (data.queryName === queryConceptSchemes) {
                lq.push(queryConceptSchemes);
                let lst = [];

                data.jsonLD.forEach((item) => {
                    lst.push(item);
                });

                this.setState({
                    conceptSchemes: lst,
                });
            }
            if (lq.length >= 4) {
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

    getLabelForItem(item) {
        let label = item['http://www.w3.org/2000/01/rdf-schema#label'];
        if (label) {
            if (label.length > 0) {
                label = label[0];
            }
            if (label["@language"]) {
                label = label["@value"] + ' (' + label["@language"] + ')';
            } else if (label["@value"]) {
                label = label["@value"];
            } else if (label["@id"]) {
                label = NamespaceStore.getShortForm(label["@id"]);
            }
        }
        return label;
    }

    constructTree(jsonLD) {
        let roots = [];
        let conceptSchemeIriToConceptsMap = {};
        let conceptIriToConceptMap = {};

        const skosPrefix = "http://www.w3.org/2004/02/skos/core#";
        const defaultConceptSchemeIri = "http://onto.fel.cvut.cz/ontologies/skos/concept-scheme/default";
        const defaultConceptScheme = new ConceptScheme(defaultConceptSchemeIri);

        if (jsonLD.length) {
            roots.push(defaultConceptScheme);

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
        };

        return roots;
    }

    renderTree() {
        const children = this.state.tree.map((node) => {
            return this._renderTree(node);
        });

        return ( <Tree
            showLine defaultExpandAll
            autoExpandParent={true}>
            {children}
        </Tree> );
    };

    _renderTree(current) {
        const children = current.children.map((child) => {
            return this._renderTree(child)
        });
        const label = NamespaceStore.getShortForm(current.labelMap ? current.labelMap["en"] : current.iri);
        return ( <TreeNode key={current.iri} title={label} disableCheckbox>{children}</TreeNode> );
    };

    getConceptSchemeForConcept(item) {
        let scheme = item["http://www.w3.org/2004/02/skos/core#inScheme"]
        if (!scheme) {
            scheme = "<UNKNOWN>"
        } else {
            if (scheme[0]) {
                scheme = scheme[0];
            }
        }

        return scheme['@id']
    }

    renderConcept(item) {
        return (<li key={item['@id']}>C:<a href={item['@id']}>{this.getLabelForItem(item)}</a>
            ({this.getConceptSchemeForConcept(item)})</li> );
    };

    renderConceptScheme(item) {
        return ( <li key={item['@id']}>CS:<a href={item['@id']}>{this.getLabelForItem(item)}</a></li> );
    };

    renderType() {
        let type = 'unknown';
        if (this.state.type && this.state.type[0]) {
            type = NamespaceStore.getShortForm(this.state.type[0]['@id']);
        }
        return <Badge bsClass="badge badge-info">{type}</Badge>;
    };

    render() {
        var list = []
        return ( <div>{this.renderType()}
            {/*<ul>{lstCS}</ul>*/}
            {/*<ul>{list}</ul>*/}
            {this.renderTree()}
        </div> );
    };
}

export default LoadingWrapper(SkosWidget, {maskClass: 'mask-container'});
