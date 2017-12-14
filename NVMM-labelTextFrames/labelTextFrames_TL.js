#target "InDesign-8.0"

var lib = (File($.fileName)).parent.parent + "/_lib/";
$.evalFile(lib + "getNameFromPath.js");
$.evalFile(lib + "getExtension.js");
$.evalFile(lib + "zFill.js");

var panelFolder = Folder.selectDialog("Pick Folder");
var panelFiles = panelFolder.getFiles();

var panelExhibit = "";
var panelTopic = "";

var stCheck = 1;
var stCount = 1;

stLeftFlag = false;
stRightFlag = false;

for(var i = 0; i < panelFiles.length; i++) {
    var fileName = getNameFromPath(panelFiles[i]);

    if(getExtension(fileName) === ".indd") {
        app.scriptPreferences.measurementUnit = MeasurementUnits.points;
        
        var doc = app.open(panelFiles[i], false);

        var panel = {
            exhibit : doc.name.split(".")[0].split("_")[0],
            topic   : doc.name.split(".")[0].split("_")[1],
            panel   : doc.name.split(".")[0].split("_")[2]
        };

        if(panel.panel !== "GP01c" && panel.panel.slice(-1)[0] !== "b") {
            if(panelTopic === panel.topic) {
                if(stLeftFlag && stRightFlag) {
                    stCount += 2;

                } else if(stLeftFlag || stRightFlag) {
                    stCount ++;
                }
                   
            } else {
                panelTopic = panel.topic;
                stCount = 1;
                stLeftFlag = false;
                stRightFlag = false;
            }
        }

        var textFrames = doc.textFrames;
    
        for(var j = 0; j < textFrames.length; j++) {
            textFrames[j].label = getLabel(textFrames[j], stCount);
        }
    
        doc.save();
        doc.close();
    }
}

function getLabel(textFrame, stCount) {
    var frameX = Math.round(textFrame.geometricBounds[1]); 
    var frameY = Math.round(textFrame.geometricBounds[0]);

    if(frameX === 410 && (frameY === 2242 || frameY === 2950)) {
        return "PT01";
    
    } else if(frameX === 0 && (frameY === 2709 || frameY == 2927)) {
        stLeftFlag = true;
        stCheck++;
        return "ST" + zFill(stCount, 2);
    
    } else if((frameX === 2232 && (frameY === 2709 || frameY === 2927)) || (frameX === 1674 && (frameY === 2709 || frameY === 2927))) {
        stRightFlag = true;
        stCheck++;
        return "ST" + zFill(stCount + 1, 2);
    
    } else if((frameX === 276 && frameY === 4977) || (frameX === 315 && frameY === 5046)) {
        return "TT01";
    
    } else if((frameX === 1949 && frameY === 4977) || (frameX === 1392 && frameY === 4977) || (frameX === 1989 && frameY === 5046) || (frameX === 1431 && frameY === 5046)) {
        return "TT02";
    
    } else if((frameX === 2508 && frameY === 4977) || (frameX === 2547 && frameY === 5046)) {
        return "TT03";
    }
    
    if(stCheck !== stCount) {
        stLeftFlag = false;
        stRightFlag = false;
    }
    return "no label";
}




