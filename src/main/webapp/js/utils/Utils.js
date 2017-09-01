'use strict';

const URL_CONTAINS_QUERY = /^.+\?.+=.+$/;

var Utils = {
    getJsonLdFirst: function getFirst( r, prop ) {
        return  ((r && r.length > 0) ? r[0][prop] : null);
    },
    /**
     * Appends parameters in the specified argument as query parameters to the specified url.
     *
     * The url can already contain a query string
     * @param url The URL to append parameters to
     * @param parameters The parameters to add
     * @return {*} Updated URL
     */
    addParametersToUrl: function (url, parameters) {
        if (parameters) {
            url += URL_CONTAINS_QUERY.test(url) ? '&' : '?';
            Object.getOwnPropertyNames(parameters).forEach(function (param) {
                url += param + '=' + parameters[param] + '&';   // '&' at the end of request URI should not be a problem
            });
        }
        return url;
    },
};

module.exports = Utils;
