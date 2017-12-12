/*
Script that prints (x, y) coordinates of text frames
*/

#target "InDesign-8.0"

var doc = app.activeDocument;
var textBoxes = doc.textFrames;

// app.horizontalMeasurementUnits = MeasurementUnits.points;
// app.verticalMeasurementUnits = MeasurementUnits.points;

app.scriptPreferences.measurementUnit = MeasurementUnits.points;

for(var i = 0; i < textBoxes.length; i++) {    
    var storyCode = textBoxes[i].label;
    
    var objectStyle = textBoxes[i].appliedObjectStyle;

    var geoBounds = textBoxes[i].geometricBounds;

    if(objectStyle.name === "Conflict Subtitle") {
        getMeasurements("Title");

    
    } else if(objectStyle.name === "Conflict Body") {
        getMeasurements("Body");
    }

}

function getMeasurements(part) {
    $.writeln(part + " x: " + geoBounds[1].toFixed(2));
    $.writeln(part +" y: " + geoBounds[0].toFixed(2));
}