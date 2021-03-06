'use strict';

import * as React from "react";
import * as Reflux from "reflux";
import {Badge,Button,ButtonGroup} from "react-bootstrap";

import {DatasetSourceStore} from "../../../../stores/DatasetSourceStore";
import NamespaceStore from "../../../../stores/NamespaceStore";
import Actions from "../../../../actions/Actions";
import LoadingWrapper from "../../../misc/LoadingWrapper";
import Hierarchy from "./Hierarchy";
import Utils from "../../../../utils/Utils";

class VocabularyWidget extends Reflux.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: null,
            languages:[],
            activeLanguages:[],
            vocabularies: []
        }
        this.store = NamespaceStore
    };

    componentWillMount() {
        this.unsubscribe = DatasetSourceStore.listen(this._onDataLoaded.bind(this));
        this.selectDatasetSource();
        super.componentWillMount();
    };

    selectDatasetSource() {
        this.props.loadingOn();
        const queryType = "vocabulary/get_vocabulary_type";
        const queryLanguage = "vocabulary/get_vocabulary_language";
        const datasetSource = DatasetSourceStore.getSelectedDatasetSource();
        Actions.executeQueryForDatasetSource(datasetSource.id, queryType);
        Actions.executeQueryForDatasetSource(datasetSource.id, queryLanguage);
    }

    _onDataLoaded = (data) => {
        if (data === undefined) {
            return
        }

        const queryType = "vocabulary/get_vocabulary_type";
        const queryLanguage = "vocabulary/get_vocabulary_language";
        const voc = "http://onto.fel.cvut.cz/ontologies/vocabulary/";

        if (data.action === Actions.selectDatasetSource) {
            this.selectDatasetSource();
        } else {
            if (data.queryName === queryType) {
                this.setState({
                    type: data.content,
                });
            } else if (data.queryName === queryLanguage) {
                let languages = {};

                if (data.content && data.content[0]) {
                    const vocLanguages = data.content[0][voc+'hasVocabularyLanguage'];
                    if ( vocLanguages ) {
                        vocLanguages. forEach((item) => {
                            languages[item['@id']]=true;
                        });
                    }
                }

                this.setState({
                    languages: languages,
                });
            }
            this.props.loadingOff();
        }
    };

    componentWillUnmount() {
        this.unsubscribe();
        super.componentWillUnmount();
    };

    s(iri) {
        return Utils.getShortForm(this.state.namespaces,iri);
    }

    renderType() {
        let type = 'unknown';
        if (this.state.type && this.state.type[0]) {
            type = this.s(this.state.type[0]['@id']);
        }
        return <Badge bsClass="badge badge-info">{type}</Badge>;
    };

    onLanguageSelect(item) {
        const l = this.state.languages;
        if ( !l[item]) {
            l[item] = false;
        }
        l[item] = !l[item];
        this.setState({
            languages: l
        });
    };

    render() {
        let langs=[];
        const languages = this.state.languages;
        if ( languages ) {
            Object.keys(languages).forEach((language) => {
                langs.push(
                    <Button key={language}
                            bsSize="small"
                            active={languages[language]}
                            onClick={() => this.onLanguageSelect(language)}>{this.s(language)}
                    </Button>);
            });
        }
        const activeLanguageArray = Object.keys(languages).filter((language) => {
            return languages[language]});

        return (
            <div>
                {this.renderType()}
                <br/>Vocabularies:
                <ButtonGroup>{langs}</ButtonGroup>
                <Hierarchy vocabularies={activeLanguageArray}/>
            </div>
        );
    };
}

export default LoadingWrapper(VocabularyWidget, {maskClass: 'mask-container'});
