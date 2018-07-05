#target "InDesign-8.0"

var panelFolder = Folder.selectDialog("Pick Folder");

var panelFiles = panelFolder.getFiles("*.indd");

for(var i = 0; i < panelFiles.length; i++) {
    app.scriptPreferences.measurementUnit = MeasurementUnits.points;
    
    var doc = app.open(panelFiles[i], false);
    
    var textFrames = doc.layers.item("TEXT").textFrames;

    for(var j = 0; j < textFrames.length; j++) {
        textFrames[j].label = getLabel(textFrames[j]);
    }

    doc.save();
    doc.close();
}

function getLabel(textFrame) {
    var frameX = Math.round(textFrame.geometricBounds[1]); 
    var frameY = Math.round(textFrame.geometricBounds[0]);

    if(frameY === 36) {
        if (frameX === 405) {
            return "main1";
        
        } else if(frameX === 1335) {
            return "main2";
        
        } else if (frameX === 2265) {
            return "main3";
        
        } else if (frameX === 3195) {
            return "main4";
        
        } else {
            return "main";
        }

    } else if(frameY === 215) {
        if(frameX === 405) {
            return "date1";
        
        } else if(frameX === 1335) {
            return "date2";
        
        } else if(frameX === 2265) {
            return "date3";
        
        } else if(frameX === 3195) {
            return "date4";
        
        } else {
            return "date";
        }


    } else if(frameY === 109) {
        if(frameX === 149) {
            return "year1";
        
        } else if(frameX === 1079) {
            return "year2";
        
        } else if(frameX === 2009) {
            return "year3";
        
        } else if(frameX === 2939) {
            return "year4";
        
        } else {
            return "year";
        }
        
    }

    return "no label";
}
