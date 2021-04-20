// FROM https://www.html5gamedevs.com/topic/4167-crossorigin-issue-using-data-uris/
var data = new Image();
data.src = assets[i].url; 
self.cache.addImage(assets[i].key, assets[i].url, data)
