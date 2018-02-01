'use strict';

import qs from "qs"

var Utils = {
    getJsonLdFirst: function getFirst( r, prop ) {
        return  ((r && r.length > 0) ? r[0][prop] : null);
    },
    /**
     * Creates query parameters as a string. Leading & or ? is not inserted.
     *
     * @param parameters The parameters to add
     * @return parameter string
     */
    createQueryParams: function (parameters) {
        return qs.stringify(parameters)
    },
};

module.exports = Utils;
