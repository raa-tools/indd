#target "InDesign-8.0"

app.scriptPreferences.measurementUnit = MeasurementUnits.inches;

var doc = app.activeDocument;
var pages = doc.pages;
var codeInfoLayer = doc.layers.item("Code and info");

for(var j = 0; j < pages.length; j++) {
    var pageWidth = Math.round(100 * pages[j].bounds[3]) / 100;
    var pageHeight = Math.round(100 * pages[j].bounds[2]) / 100;

    var textFrames = pages[j].textFrames;

    for(var i = 0; i < textFrames.length; i++) {
        if(textFrames[i].itemLayer === codeInfoLayer && textFrames[i].label === "dimsInput") {
            textFrames[i].contents = pageWidth + " × " + pageHeight + " in.";
        }
    }
}



