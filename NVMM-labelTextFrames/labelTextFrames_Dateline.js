#target "InDesign-8.0"

var lib = (File($.fileName)).parent.parent + "/functionLib/";
$.evalFile(lib + "getNameFromPath.js");
$.evalFile(lib + "checkExtension.js");

var panelFolder = Folder.selectDialog("Pick Folder");

var panelFiles = panelFolder.getFiles();

for(var i = 0; i < panelFiles.length; i++) {
    var fileName = getNameFromPath(panelFiles[i]);

    if(checkExtension(fileName, ".indd")) {
        app.scriptPreferences.measurementUnit = MeasurementUnits.points;
        
        var doc = app.open(panelFiles[i], false);
        
        var textFrames = doc.layers.item("TEXT").textFrames;
    
        for(var j = 0; j < textFrames.length; j++) {
            textFrames[j].label = getLabel(textFrames[j]);
        }
    
        doc.save();
        doc.close();
    }
}

function getLabel(textFrame) {
    var frameX = Math.round(textFrame.geometricBounds[1]); 
    var frameY = Math.round(textFrame.geometricBounds[0]);

    if((frameX === 405 || frameX === 1335 || frameX === 2265 || frameX === 3195) && frameY === 36) {
        return "main";
    } else if((frameX === 405 || frameX === 1335 || frameX === 2265 || frameX === 3195) && frameY === 215) {
        return "date";
    } else if((frameX === 149 || frameX === 1079 || frameX === 2009 || frameX === 2939) && frameY === 109) {
        return "year";
    }

    return "no label";
}
