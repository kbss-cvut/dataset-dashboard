/**
 * Created by blcha on 25.4.17.
 */
'use strict';

export default class Rdfs {

    static get NS() {
        return 'http://www.w3.org/2000/01/rdf-schema#';
    }

    static get label() {
        return this.NS + 'label';
    }
}
