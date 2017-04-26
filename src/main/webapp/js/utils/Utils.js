'use strict';

var Utils = {
    getJsonLdFirst: function getFirst( r, prop ) {
        return  ((r && r.length > 0) ? r[0][prop] : null);
    }
};

module.exports = Utils;
