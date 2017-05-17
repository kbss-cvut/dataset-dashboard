'use strict';

import React from "react";
import DatasetSourceStore from "../../../../stores/DatasetSourceStore";
import NamespaceStore from "../../../../stores/NamespaceStore";
import Actions from "../../../../actions/Actions";
import LoadingWrapper from "../../../misc/LoadingWrapper";
import {Badge,Button,ButtonGroup} from "react-bootstrap";
import Hierarchy from "./Hierarchy";

class VocabularyWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: null,
            languages:[],
            activeLanguages:[],
            vocabularies: []
        }
    };

    componentWillMount() {
        this.unsubscribe = DatasetSourceStore.listen(this._onDataLoaded.bind(this));
    };

    _onDataLoaded = (data) => {
        if (data === undefined) {
            return
        }

        const queryType = "vocabulary/get_vocabulary_type";
        const queryLanguage = "vocabulary/get_vocabulary_language";
        const voc = "http://onto.fel.cvut.cz/ontologies/vocabulary/";

        if (data.action === Actions.selectDatasetSource) {
            this.props.loadingOn();
            Actions.executeQueryForDatasetSource(data.datasetSource.hash, queryType);
            Actions.executeQueryForDatasetSource(data.datasetSource.hash, queryLanguage);
        } else {
            if (data.queryName === queryType) {
                this.setState({
                    type: data.jsonLD,
                });
            } else if (data.queryName === queryLanguage) {
                let languages = {};

                if (data.jsonLD && data.jsonLD[0]) {
                    const vocLanguages = data.jsonLD[0][voc+'hasVocabularyLanguage'];
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
    };

    renderType() {
        let type = 'unknown';
        if (this.state.type && this.state.type[0]) {
            type = NamespaceStore.getShortForm(this.state.type[0]['@id']);
        }
        return <Badge bsClass="badge badge-info">{NamespaceStore.getShortForm(type)}</Badge>;
    };

    onLanguageSelect(item) {
        const l = this.state.languages;
        if ( !l[item]) {
            l[item] = false;
        }
        l[item] = !l[item];
        console.log(l);
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
                    <Button bsSize="small"
                            active={languages[language]}
                            onClick={() => this.onLanguageSelect(language)}>{NamespaceStore.getShortForm(language)}
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