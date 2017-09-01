/**
 * Created by blcha on 25.4.17.
 */
'use strict';

export default class Void {

    static get NS() {
        return 'http://rdfs.org/ns/void#';
    }

    static get ENTITIES() {
        return this.NS + 'entities';
    }

    static get CLASS() {
        return this.NS + 'class';
    }

    static get PROPERTY() {
        return this.NS + 'property';
    }

    static get TRIPLES() {
        return this.NS + 'triples';
    }

    static get DISTINCT_OBJECTS() {
        return this.NS + 'distinctSubjects';
    }

    static get DISTINCT_SUBJECTS() {
        return this.NS + 'distinctObjects';
    }
}
