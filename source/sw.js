//This is the service worker with the combined offline experience (Offline page + Offline copy of pages)

//Install stage sets up the offline page in the cahche and opens a new cache
self.addEventListener('install', function(event) {
    event.waitUntil(preLoad());
  });
  
  var preLoad = function(){
    console.log('[PWA Builder] Install Event processing');
    return caches.open('pwabuilder-offline').then(function(cache) {
      return cache.addAll(['/offline.html', '/', '/all-tags/', '/all-archives/']);
    });
  }
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(checkResponse(event.request).catch(function() {
      return returnFromCache(event.request)}
    ));
    event.waitUntil(addToCache(event.request));
  });
  
  var checkResponse = function(request){
    return new Promise(function(fulfill, reject) {
      fetch(request).then(function(response){
        if(response.status !== 404) {
          fulfill(response)
        } else {
          reject()
        }
      }, reject)
    });
  };
  
  var addToCache = function(request){
    return caches.open('pwabuilder-offline').then(function (cache) {
      return fetch(request).then(function (response) {
        return cache.put(request, response);
      });
    });
  };
  
  var returnFromCache = function(request){
    return caches.open('pwabuilder-offline').then(function (cache) {
      return cache.match(request).then(function (matching) {
       if(!matching || matching.status == 404) {
         return cache.match('offline.html')
       } else {
         return matching
       }
      });
    });
  };