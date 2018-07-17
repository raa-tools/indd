#target InDesign

var unlockLayers = function(layers) {
  for(var i = 0; i < layers.length; i++) {
    if(!layers[i].locked) continue;

    layers[i].locked = false;
  }
}

var outlineText = function() {
  var pages = app.activeDocument.pages;

  for(var i = 0; i < pages.length; i++) {
    var pageItems = pages[i].allPageItems;

    for(var j = 0; j < pageItems.length; j++) {
      if(!(pageItems[j] instanceof TextFrame)) continue;
      pageItems[j].createOutlines();
    }
  }
}

var lockLayer = function(layers, layerName) {
  for(var i = 0; i < layers.length; i ++) {
    if(layers[i].name !== layerName) continue;

    layers[i].locked = true;
  }
}

var layers = app.activeDocument.layers;

unlockLayers(layers);
outlineText();
lockLayer(layers, "Code and info");