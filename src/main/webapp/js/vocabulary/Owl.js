'use strict';

export default class Owl {

    static get NS() {
        return 'http://www.w3.org/2002/07/owl#';
    }

    static get THING() {
        return this.NS + 'Thing';
    }
}
