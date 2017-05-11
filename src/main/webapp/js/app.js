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

main();
