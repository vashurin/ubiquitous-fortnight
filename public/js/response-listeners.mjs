"use strict";

import createDB from './db.mjs';
import { createTemplate } from './viewer.mjs';
import { 
    DB_NAME,
    DATA_VERSION, 
    KEY_PATH, 
    DATA_TEXT,
    APP_ID 
} from './const.mjs';
/***
* Ajax error listener
* @param statusCode - Error code
*/
export function backendErrorHandler(statusCode){
	console.log("failed with status: " + statusCode);
}

/***
* Ajax success listener
* @param data - Backend respons (JSON)
*/
export function backendResponse(data) {
    let dbOptions = {
        name: DATA_TEXT,
        version: DATA_VERSION,
        keyPath: KEY_PATH
    };
    createDB({
        data: data, 
        name: DB_NAME, 
        options: dbOptions
    }).then(
        createView, //success
        createDB_Error //error
    );
}

/***
* If ok then start App
*/
function createView(){
    createTemplate( APP_ID );
}

/***
* If not ok then console event message
*/
function createDB_Error(event) {
    console.log("failed with status: " + event);
}
