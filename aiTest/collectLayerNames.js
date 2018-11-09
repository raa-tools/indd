#target illustrator

var doc = app.activeDocument;
var layers = doc.layers;
var layerNames = [];

for(var i = 0; i < layers.length; i++) {
  layerNames.push(layers[i].name)
}

var width = 500
var height = 1000
var margin = 30

var textPath = doc.pathItems.add();
textPath.setEntirePath ([
    [margin, -margin],
    [margin, -height - margin],
    [width + margin, -height - margin],
    [width + margin, -margin]
]);

var newTextFrame = doc.textFrames.areaText(textPath);
newTextFrame.contents = layerNames.join("\n")
