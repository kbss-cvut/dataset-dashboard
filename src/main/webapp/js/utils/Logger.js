'use strict';

const Logger = {

    log: function (msg) {
        console.log(msg);
    },

    warn: function (msg) {
        if (console.warn) {
            console.warn(msg);
        } else {
            console.log('WARNING: ' + msg);
        }
    },

    error: function (msg) {
        if (console.error) {
            console.error(msg);
        } else {
            console.log('ERROR: ' + msg);
        }
    }
};

export default Logger;
