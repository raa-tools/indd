#target InDesign

app.scriptPreferences.measurementUnit = MeasurementUnits.points;

var moveXby = 0;
var moveYby = 8;
var layerName = "TEXT";
var paragraphStyleToFind = "Yiddish Hebrew";

var thisDoc = app.activeDocument;
var textLayer = thisDoc.layers.item(layerName);

for (var i = 0; i < textLayer.textFrames.length; i++) {
  var textFrame = textLayer.textFrames[i];
  var paragraphStyleName = textFrame.paragraphs[0].appliedParagraphStyle.name;

  if (paragraphStyleName.toLowerCase() === paragraphStyleToFind.toLowerCase()) {
    textFrame.move(undefined, [moveXby, moveYby]);
  }
}

