#target illustrator

var layers = app.activeDocument.layers;

for(var i = 0; i < layers.length; i ++) {
  if(!layers[i].locked) {
    layers[i].rasterItems.removeAll();

    var paths = layers[i].pathItems;

    for(var j = 0; j < paths.length; j ++) {
      if(paths[j].pathPoints.length === 4) {
        paths[j].remove();
      };
    };
  };
};