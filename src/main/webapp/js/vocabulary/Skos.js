'use strict';

export default class Skos {

    static get NS() {
        return 'http://www.w3.org/2004/02/skos/core#';
    }

    static get CONCEPT() {
        return this.NS + 'Concept';
    }
}
