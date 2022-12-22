"use strict";

/***
* Ajax function
* @param URL - Server URL, 
* @param methodType - Send method,
* @resolve - Success listener (functon)
* @reject - Error listener (function)
*/
const ajax = function(url, methodType){
 let promiseObj = new Promise(function(resolve, reject){
      var xhr = new XMLHttpRequest();
      xhr.open(methodType, url, true);
      xhr.send();
      xhr.onreadystatechange = function(){
      if (xhr.readyState === 4){
         if (xhr.status === 200){
            let resp = xhr.responseText;
            let json = JSON.parse(resp);
            resolve(json);
         } else {
            reject(xhr.status);
         }
      } 
   }
 });
 return promiseObj;
}

export default ajax;