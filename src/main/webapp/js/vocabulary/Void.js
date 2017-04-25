/**
 * Created by blcha on 25.4.17.
 */
'use strict';

const VOID_NS = 'http://rdfs.org/ns/void#',
    ENTITIES = VOID_NS  + 'entities',
    CLASS = VOID_NS  + 'class',
    PROPERTY = VOID_NS  + 'property',
    TRIPLES = VOID_NS  + 'triples',
    DISTINCT_OBJECTS = VOID_NS  + 'distinctSubjects',
    DISTINCT_SUBJECTS = VOID_NS  + 'distinctObjects';


export default class Void {
    static get ENTITIES() {
        return ENTITIES;
    }

    static get CLASS() {
        return CLASS;
    }

    static get PROPERTY() {
        return PROPERTY;
    }

    static get TRIPLES() {
        return TRIPLES;
    }

    static get DISTINCT_OBJECTS() {
        return DISTINCT_OBJECTS;
    }

    static get DISTINCT_SUBJECTS() {
        return DISTINCT_SUBJECTS;
    }

}
