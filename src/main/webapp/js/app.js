/**
 Main entry point for the ReactJS frontend
 */

'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Actions = require('./actions/Actions');

function main() {
    const Main = require('./Main').default;
    ReactDOM.render(<Main/>, document.getElementById('content'));
}


Actions.registerDatasetSourceNamedGraph("http://linked.opendata.cz/sparql",
    "http://data.czso.cz/resource/dataset/demography-in-regions-czech-republic-age-categories");
Actions.registerDatasetSourceNamedGraph("http://linked.opendata.cz/sparql",
    "http://linked.opendata.cz/resource/dataset/seznam.gov.cz/ovm");
Actions.registerDatasetSourceNamedGraph("http://linked.opendata.cz/sparql",
    "http://ruian.linked.opendata.cz/resource/dataset");

// Actions.registerDatasetSourceEndpoint("http://onto.fel.cvut.cz/rdf4j-server/repositories/eurovoc-thesaurus");
// Actions.registerDatasetSourceEndpoint("http://onto.fel.cvut.cz/rdf4j-server/repositories/issue-tracking-thesaurus");

// Actions.getAllDatasetSources();

Actions.registerNamespace('http://www.w3.org/2001/XMLSchema#','xsd');
Actions.registerNamespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#','rdf');
Actions.registerNamespace('http://www.w3.org/2000/01/rdf-schema#','rdfs');
Actions.registerNamespace('http://www.w3.org/2002/07/owl#','owl');

Actions.registerNamespace('http://www.w3.org/2004/02/skos/core#','skos');
Actions.registerNamespace('http://schema.org/','schema');
Actions.registerNamespace('http://xmlns.com/foaf/0.1/','foaf');
Actions.registerNamespace('http://purl.org/goodrelations/v1#','gr');
Actions.registerNamespace('http://purl.org/dc/terms/','dcterms');
Actions.registerNamespace('http://www.w3.org/ns/dcat#','dcat');
Actions.registerNamespace('http://rdfs.org/ns/void#','void');
Actions.registerNamespace('http://www.w3.org/2006/vcard/ns#','vcard');

Actions.registerNamespace('http://linked.opendata.cz/ontology/domain/seznam.gov.cz/ovm/PravniForma/','ovm-pravni-forma');
Actions.registerNamespace('http://linked.opendata.cz/ontology/domain/seznam.gov.cz/ovm/StavDatoveSchranky/','ovm-stav-datove-schranky');



main();
