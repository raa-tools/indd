#target "InDesign"

app.scriptPreferences.measurementUnit = MeasurementUnits.points;

var doc = app.activeDocument;

var varImgName = doc.textVariables.item("Image Name");

var rects = doc.layers.item("IMAGES").rectangles;

for(var i = 0; i < rects.length; i++) {
    var imgY = rects[i].geometricBounds[0];
    var imgX = rects[i].geometricBounds[1];

    var gNumFrame = doc.textFrames.add({geometricBounds: [imgY, imgX, imgY + 38, imgX + 512]});
    gNumFrame.textVariableInstances.add({associatedTextVariable: varImgName});
    gNumFrame.parentStory.appliedParagraphStyle = "New Code Bold";
    gNumFrame.parentStory.appliedCharacterStyle = doc.characterStyles.item("[None]");
    gNumFrame.parentStory.clearOverrides();
}

