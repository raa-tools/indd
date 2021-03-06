﻿/*
Duplicate a set of selected rectangles and replace content with selected files
*/

#target "InDesign-8.0"

app.scriptPreferences.measurementUnit = MeasurementUnits.points;

var selectedObjects = app.activeWindow.selection;
var selectedFiles = File.openDialog("Select files", multiSelect = true);

for(var i = 0; i < selectedObjects.length; i++) {
    if(selectedObjects[i] instanceof Oval || selectedObjects[i] instanceof Rectangle || selectedObjects[i] instanceof Polygon) {
        var y = selectedObjects[i].geometricBounds[0];
        var xMax = selectedObjects[i].geometricBounds[3];

        // j starts at 0 so we can replace the content of the original objects
        // If this is unnecessary, j can start at 1
        for(var j = 0; j < selectedFiles.length; j++) {
            if(j === 0) {
                var dupeObjects = selectedObjects[i];
            
            } else {
                // Need to figure out this math...
                // Duplicating by offset instead of location, but amount is still hardcoded (1000 pts)
                dupeObjects = selectedObjects[i].duplicate(undefined, [j * 1000, 0]);
            }
            
            // Determine how to crop PDF... not very elegant
            // Also currently limited to PDFs — need to look into other graphic types
            if(dupeObjects.label === "main") {
                app.pdfPlacePreferences.pdfCrop = PDFCrop.CROP_ART;
                
            } else if(dupeObjects.label === "slug") {
                app.pdfPlacePreferences.pdfCrop = PDFCrop.CROP_MEDIA;
            }
            
            dupeObjects.place(selectedFiles[j]);
            dupeObjects.select(existingSelection = SelectionOptions.ADD_TO);
        }
    }
}
