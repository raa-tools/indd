#target "InDesign-8.0"

var lib = (File($.fileName)).parent.parent + "/_lib/";
$.evalFile(lib + "getNameFromPath.js");
$.evalFile(lib + "getExtension.js");

var panelFolder = Folder.selectDialog("Select Panel Folder");
var pdfFolder = Folder.selectDialog("Select Date Folder");

var panelFiles = panelFolder.getFiles();

for(var i = 0; i < panelFiles.length; i++){
    var fileName = getNameFromPath(panelFiles[i]);

    if(getExtension(fileName) === ".indd"){
        app.scriptPreferences.measurementUnit = MeasurementUnits.points;
        app.pdfPlacePreferences.pdfCrop = PDFCrop.CROP_ART;

        var doc = app.open(panelFiles[i], false);

        var panelCode = doc.name.split(".")[0];

        var panel = {
            exhibit : panelCode.split("_")[0],
            topic   : panelCode.split("_")[1],
            panel   : panelCode.split("_")[2]
        };

        var newPDF = new File(pdfFolder + "/" + panel.exhibit + "_" + panel.topic + "_GP01c.pdf");

        var targetLayer = doc.layers.item("DATE PLACEMENT - DO NOT PRINT");

        var textFrames = targetLayer.textFrames;

        for(var j = 0; j < textFrames.length; j++) {
            textFrames[j].remove();
        }

        var newRect = doc.rectangles.add(targetLayer, {geometricBounds : [0, 0, 612, 3888]});
        newRect.place(newPDF);

    
        doc.save();
        doc.close();
    }
}



