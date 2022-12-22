"use strict";

/***
 * Add data to indexedDB
 * @param evenet - onupgradeneeded event
 * @param data - Backend respons (JSON) 
 * @param dbOptions - Object 'DB options' (ex.: {name: 'SomeName', version: '1', keyPath: 'id'})
 */
function addDefaultDataToDB(db, data, dbOptions) {
    const objStoreName = String(dbOptions.name);
    let objKeys = Object.keys(data[0]); //get keys
    let objectStore = db.createObjectStore(objStoreName, { keyPath: String(dbOptions.keyPath) });    
    let indexes = objKeys.map(function(key) {
      return key; //from key to index
    });

    indexes.forEach(function(item) {
      objectStore.createIndex(String(item), String(item), { unique: false }); //create index
    });

    objectStore.transaction.oncomplete = function(event) {
      //console.log(event);
      let dataObjectStore = db.transaction(objStoreName, "readwrite").objectStore(objStoreName);
      data.forEach(function(d) {
          dataObjectStore.add(d);
      });
    };    
}

/***
 * Create indexedDB function
 * @param dbSettings - Object {data, dbName, dbOptions}
 * @param data - Backend respons (JSON) 
 * @param name - DB name
 * @param options - options
 */
const createDB = function(dbSettings) {
  let promiseObj = new Promise(function(resolve, reject) {
      let request = indexedDB.open(dbSettings.name, 2);
      
      request.onerror = function(event) {
        reject(event);
      };
      request.onupgradeneeded = function(event) {
        addDefaultDataToDB(event.target.result, dbSettings.data, dbSettings.options);
        resolve();
      };   
      request.onsuccess = function(e) {
        resolve();
      };
    });

  return promiseObj;
}

export default createDB;