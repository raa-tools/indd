#target "InDesign-8.0"

var panelFolder = Folder.selectDialog("Pick Folder");

var panelFiles = panelFolder.getFiles();

for(var i = 0; i < panelFiles.length; i++) {
    if(getNameFromPath(panelFiles[i]) !== ".DS_Store") {
        app.scriptPreferences.measurementUnit = MeasurementUnits.points;
        
        var doc = app.open(panelFiles[i], false);
        
        var textFrames = doc.textFrames;
    
        for(var j = 0; j < textFrames.length; j++) {
            textFrames[j].label = getLabel(textFrames[j]);
        }
    
        doc.save();
        doc.close();
    }
}

function getNameFromPath(inputPath){
    return inputPath.toString().split("/").slice(-1)[0];
}

function getLabel(textFrame) {
    var frameX = Math.round(textFrame.geometricBounds[1]); 
    var frameY = Math.round(textFrame.geometricBounds[0]);

    if(frameX === 410 && (frameY === 2242 || frameY === 2950)) {
        return "PT01";
    
    } else if(frameX === 0 && (frameY === 2709 || frameY == 2927)) {
        return "ST01";
    
    } else if((frameX === 2232 && (frameY === 2709 || frameY === 2927)) || (frameX === 1674 && (frameY === 2709 || frameY === 2927))) {
        return "ST02";
    
    } else if((frameX === 276 && frameY === 4977) || (frameX === 315 && frameY === 5046)) {
        return "TT01";
    
    } else if((frameX === 1949 && frameY === 4977) || (frameX === 1392 && frameY === 4977) || (frameX === 1989 && frameY === 5046) || (frameX === 1431 && frameY === 5046)) {
        return "TT02";
    
    } else if((frameX === 2508 && frameY === 4977) || (frameX === 2547 && frameY === 5046)) {
        return "TT03";
    }
    
    return "no label";
}




