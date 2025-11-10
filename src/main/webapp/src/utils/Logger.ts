'use strict';

const Logger = {

    log: function (msg:string) {
        console.log(msg);
    },

    warn: function (msg:string) {
        if (console.warn) {
            console.warn(msg);
        } else {
            console.log('WARNING: ' + msg);
        }
    },

    error: function (msg:string) {
        if (console.error) {
            console.error(msg);
        } else {
            console.log('ERROR: ' + msg);
        }
    }
};

export default Logger;
