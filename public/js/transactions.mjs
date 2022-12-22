"use strict";

/***
 * Get indexes name for viewer
 * @param dbName - DB name
 * @param tableName - table name 
 */
export function getIndexNames(dbName, tableName) {
    let promiseObj = new Promise(function(resolve, reject) {
        let openRequest = indexedDB.open(dbName);
        openRequest.onsuccess = (event) => {
            let db = event.target.result;
            let store = db.transaction(tableName).objectStore(tableName);
            resolve(store.indexNames);
        };
        openRequest.onerror = (event) => {
            reject();
        }
    });

    return promiseObj;        
}


/***
 * Get data range by index, start & end date
 * @param dbName - DB name
 * @param tableName - table name 
 * @param index - key
 * @param startDate - start range
 * @param endDate - end range
 */
export function getRengeByDate(dbName, tableName, index, startDate, endDate) {
    let promiseObj = new Promise(function(resolve, reject) {
        let openRequest = indexedDB.open(dbName);
        
        openRequest.onsuccess = (event) => {
            let db = event.target.result;
            let keyRangeValue = IDBKeyRange.bound(startDate, endDate)
            let transaction = db.transaction(tableName, 'readonly');
            let objectStore = transaction.objectStore(tableName);
        
            let myIndex = objectStore.index(index);
            let result = []
            myIndex.openCursor(keyRangeValue).onsuccess = function(event) {
                let cursor = event.target.result;
                if(cursor) {
                    //console.log(cursor.value)
                    result.push(cursor.value)
                    cursor.continue();
                } else {
                    resolve(result)
                }
            };
            myIndex.openCursor(keyRangeValue).onerror = function(event) {
                reject(event)
            }
        }
    });

    return promiseObj;  
}