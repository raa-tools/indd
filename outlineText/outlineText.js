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
    var textFrames = pages[i].textFrames.everyItem();
    try {
      textFrames.createOutlines();
    } catch(e) {
      $.writeln(e);
    };
  }
}

var lockLayer = function(layers, layerName) {
  for(var i = 0; i < layers.length; i ++) {
    if(layers[i].name !== layerName) continue;

    layers[i].locked = true;
  }
}

if(app.documents.length !== 0) {
  var layers = app.activeDocument.layers;

  unlockLayers(layers);
  outlineText();
  lockLayer(layers, "Code and info");

} else {
  var panelFolder = Folder.selectDialog("Pick panels");
  var panelFiles = panelFolder.getFiles("*.indd");

  for(var i = 0; i < panelFiles.length; i++) {
    var panelFile = app.open(panelFiles[i])
    var layers = app.activeDocument.layers;

    unlockLayers(layers);
    outlineText();
    lockLayer(layers, "Code and info");

    panelFile.save();
    panelFile.close();
  }
}
