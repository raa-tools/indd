#target "InDesign-8.0"

var lib = (File($.fileName)).parent.parent + "/_lib/";
$.evalFile(lib + "getNameFromPath.js");
$.evalFile(lib + "getExtension.js");
$.evalFile(lib + "zFill.js");

var panelFolder = Folder.selectDialog("Pick Folder");
var panelFiles = panelFolder.getFiles();

var panelTopic = "";

var stNum;

hasLeft = false;
hasRight = false;

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
            if(panelTopic !== panel.topic) {
                stNum = 1;
                panelTopic = panel.topic;
                hasLeft = false;
                hasRight = false;
            
            } else {
                if(hasLeft && hasRight) {
                    stNum += 2;
                    hasLeft = false;
                    hasRight = false;
    
                } else if(hasLeft || hasRight) {
                    stNum ++;
                    hasLeft = false;
                    hasRight = false;
                }
            }

            var textFrames = doc.textFrames;
            var stCount = 0;
        
            for(var j = 0; j < textFrames.length; j++) {
                stCount = countST(textFrames[j]);

                textFrames[j].label = getLabel(textFrames[j], stNum, stCount);
            }
        
            doc.save();
            doc.close();
        }
    }
}

function countST(textFrame) {
    var frameX = Math.round(textFrame.geometricBounds[1]); 
    var objectStyle = textFrame.appliedObjectStyle.name;

    if(frameX === 0 && objectStyle.indexOf("National") !== -1) {
        stCount++

    } else if((frameX === 2232 && objectStyle.indexOf("National") !== -1) || (frameX === 1674 && objectStyle.indexOf("National") !== -1)) {
        stCount++
    }
    $.writeln(stCount);
    return stCount;
}

function getLabel(textFrame, stNum, stCount) {
    var frameX = Math.round(textFrame.geometricBounds[1]); 
    var frameY = Math.round(textFrame.geometricBounds[0]);
    var objectStyle = textFrame.appliedObjectStyle.name;
    
    var stSecond;
    
    if(frameX === 410 && (frameY === 2242 || frameY === 2950)) {
        return "PT01";
    
    } else if(frameX === 0 && objectStyle.indexOf("National") !== -1) {
        hasLeft = true;

        return "ST" + zFill(stNum, 2);
    
    } else if((frameX === 2232 && objectStyle.indexOf("National") !== -1) || (frameX === 1674 && objectStyle.indexOf("National") !== -1)) {
        hasRight = true;
        
        if(stCount === 2) {
            stSecond = stNum;
        } else if(stCount === 4) {
            stSecond = stNum + 1;
        }

        return "ST" + zFill(stSecond, 2);
    
    } else if((frameX === 276 && frameY === 4977) || (frameX === 315 && frameY === 5046)) {
        return "TT01";
    
    } else if((frameX === 1949 && frameY === 4977) || (frameX === 1392 && frameY === 4977) || (frameX === 1989 && frameY === 5046) || (frameX === 1431 && frameY === 5046)) {
        return "TT02";
    
    } else if((frameX === 2508 && frameY === 4977) || (frameX === 2547 && frameY === 5046)) {
        return "TT03";
    }

    return "no label";
}