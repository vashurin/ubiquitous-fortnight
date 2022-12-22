"use strict";
import ajax from './ajax.mjs';
import { backendResponse, backendErrorHandler } from './response-listeners.mjs';
import { DEFAULT_URL } from './const.mjs';

/***
 * Start code
 */
function init() {    
    const responseMethod = 'GET';
    ajax(DEFAULT_URL, responseMethod).then(
        backendResponse, 
        backendErrorHandler
    );
}

init();