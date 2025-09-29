'use strict';

import * as Cookies from 'js-cookie';
import * as request from 'superagent';

import Logger from "./Logger";

const csrfTokenHeader = 'X-CSRF-Token';

const Ajax = {
    req: null as request.Request | null,

    getCsrfToken: function () {
        var cookie = Cookies.get('CSRF-TOKEN');
        return cookie ? cookie : '';
    },

    get: function (url:string) {
        this.req = request.get(url).accept('json');
        return this;
    },

    post: function (url:string, data:any, type:string) {
        this.req = request.post(url).type(type ? type : 'json').accept('json');
        if (data) {
            this.req = this.req.send(data);
        }
        return this;
    },

    attach: function (file:any) {
        // Remove the content type to force the browser to fill it in for us
        // See http://uncorkedstudios.com/blog/multipartformdata-file-upload-with-angularjs, section Making the
        // multipart/form-data request
        this.req = this.req!.attach('file', file, file.name).type("");
        return this;
    },

    put: function (url:string, data:any) {
        this.req = request.put(url).type('json');
        if (data) {
            this.req = this.req.send(data);
        }
        return this;
    },

    del: function (url:string) {
        this.req = request.del(url);
        return this;
    },

    send: function (data:any) {
        this.req = this.req!.send(data);
        return this;
    },

    /**
     * Executes the previously configured request.
     * @param onSuccess Success handler, it is passed data parsed from the JSON in the response (if present) and the
     *     response itself
     * @param onError Error handler, called when the request returns a non-2xx status. If the error response contains a
     *     parseable JSON object, it is passed to the handler
     */
    end: function (onSuccess:(data:any, resp:any) => void, onError: (data?:any, err?:any) => void) {
        this._extendPortalSession();
        this.req!.set(csrfTokenHeader, this.getCsrfToken()).end((err:any, resp: request.Response)=> {
            if (err) {
                if ((err.status === 401) || (err.status === 403)) {
                    if (onError) {
                        onError();
                    }
                    return;
                }
                try {
                    if (onError) {
                        onError(JSON.parse(err.response.text), err);
                    }
                    this._handleError(err);
                } catch (ex) {
                    // The response text is not a parseable JSON
                    this._handleError(err);
                }
            } else if (onSuccess) {
                onSuccess(resp.body, resp);
            }
        });
    },

    /**
     * Extends portal session if the application is running on Liferay.
     * @private
     */
    _extendPortalSession: function () {
        // if (!top.Liferay) {
        //     return;
        // }
        // top.Liferay.Session.extend();
    },

    _handleError: function (err:any) {
        try {
            var error = JSON.parse(err.response.text),
                method = err.response.req.method,
                msg = method + ' ' + error.requestUri + ' - Status ' + err.status + ': ' + error.message;
            if (err.status === 404) {
                Logger.warn(msg);
            } else {
                Logger.error(msg);
            }
        } catch (ex) {
            Logger.error('AJAX error: ' + err.response.text);
        }
    }
};

export default Ajax;
