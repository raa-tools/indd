/*
Duplicate a set of selected rectangles and replace content with selected files
*/

#target "InDesign-8.0"

var doc = app.activeWindow;
var selectedObjects = doc.selection;
var selectFiles = File.openDialog("Select files", multiSelect = true);

for(var i = 0; i < selectedObjects.length; i++) {
    if(selectedObjects[i] instanceof Oval || selectedObjects[i] instanceof Rectangle || selectedObjects[i] instanceof Polygon) {
        var y = selectedObjects[i].geometricBounds[0];
        var xMax = selectedObjects[i].geometricBounds[3];

        for(var j = 0; j < selectFiles.length; j++) {
            if(j === 0) {
                var dupeObjects = selectedObjects[i];
            
            } else {    
                dupeObjects = selectedObjects[i].duplicate(to = [xMax * j + xMax * (.10 / j), y]);
            }
            
            if(dupeObjects.label === "main") {
                app.pdfPlacePreferences.pdfCrop = PDFCrop.CROP_ART;
                
            } else if(dupeObjects.label === "slug") {
                app.pdfPlacePreferences.pdfCrop = PDFCrop.CROP_MEDIA;
            }
            
            dupeObjects.place(selectFiles[j]);
            dupeObjects.select(existingSelection = SelectionOptions.ADD_TO);
        }
    }
}
