#target "InDesign-8.0"

try {
    // Library dependencies
    var lib = (File($.fileName)).parent.parent + "/_lib/";
    $.evalFile(lib + "zFill.js");
    
    var panelFolder = Folder.selectDialog("Pick Folder");
    var panelFiles = panelFolder.getFiles("*.indd");
    
    var panelTopic = "";
    var stTotal; var ttTotal;
    var leftST = false; var rightST = false;
    var leftTT = false; var midTT = false; var rightTT = false;
    
    main();
    
} catch (error) {
    if (error.name === "IOError") {
        alert("zFill function missing from /_lib/");
    
    } else if(error.name === "TypeError") {
        alert("No panel folder selected");

    } else {
        $.writeln(error);
    }
}

function main() {
    for(var i = 0; i < panelFiles.length; i++) {
        app.scriptPreferences.measurementUnit = MeasurementUnits.points;
        
        var doc = app.open(panelFiles[i], false);
    
        var panel = {
            exhibit : doc.name.split(".")[0].split("_")[0],
            topic   : doc.name.split(".")[0].split("_")[1],
            panel   : doc.name.split(".")[0].split("_")[2]
        };
    
        // Excluding some panels that aren't full TL panels
        if(panel.panel === "GP01c") {
            doc.close();
            continue
        } 
        
        // Check if panel is within the same panel topic
        // If not, it's because we're at the beginning of a topic, 
        // so reset counter and flags & remember the topic we're at
        if(panelTopic !== panel.topic) {
            stTotal = 0;
            ttTotal = 0;
            panelTopic = panel.topic;
        }
    
        // Reset flags and counters per file
        leftST = false; rightST = false;
        leftTT = false; midTT = false; rightTT = false;
        numOfSTOnThisPanel = 0;
        
        var textFrames = doc.layers.item("TEXT").textFrames;
    
        // Count
        // Has to be separated because the script has to "understand"
        // the panel before applying labels
        for(var z = 0; z < textFrames.length; z++) {
            var frameX = Math.round(textFrames[z].geometricBounds[1]);
            var objectStyle = textFrames[z].appliedObjectStyle.name;
            
            // countNumOfST(frameX, objectStyle);
            countNumOfTT(frameX, objectStyle);
            
            // if (leftST && rightST){
            //     numOfSTOnThisPanel = 2;
    
            // } else if (leftST || rightST) {
            //     numOfSTOnThisPanel = 1;
            // }
        }

        $.writeln(ttTotal)
    
        // Label
        // for(var j = 0; j < textFrames.length; j++) {
        //     textFrames[j].label = getLabel(textFrames[j], numOfSTOnThisPanel, stTotal);
        // }
    
        doc.save();
        doc.close();
    }
}


// Checks how many STs there are through the x-position of ST titles
// (there's always 1 title per ST)
function countNumOfST(frameX, objectStyle) {
    // 1674pt is the left-most x-value for a "right" ST box
    if(frameX < 1674 && objectStyle === "National Title") {
        stTotal++;
        leftST = true;

    } else if(frameX >= 1674 && objectStyle === "National Title") {
        stTotal++;
        rightST = true;
    }
}

// Checks how many TTs there are through the x-position of TT titles
// (there's always 1 title per TT)
function countNumOfTT(frameX, objectStyle) {
    if((frameX === 276 || frameX === 50) && objectStyle === "Veterans Title") {
        ttTotal++;
        leftTT = true;
    
    } else if(frameX === 1392 && objectStyle === "Veterans Title") {
        ttTotal++;
        midTT = true;
    
    // TT Right has 2 possible locations, depending on how the panel is divided
    // >= 1949 guarantees that these 2 possible locations are counted as part of TT Right
    } else if(frameX >= 1949 && objectStyle === "Veterans Title") {
        ttTotal++;
        rightTT = true;
    }
}


function getLabel(textFrame, stNum, stCount) {
    var frameX = Math.round(textFrame.geometricBounds[1]); 
    var frameY = Math.round(textFrame.geometricBounds[0]);
    var objectStyle = textFrame.appliedObjectStyle.name;
    
    // Primary
    if(frameX === 410 && (frameY === 2242 || frameY === 2950)) {
        return "PT01";
    } 
    
    // Secondary
    // Using < and >= also lets us label the Captions box without extra code!
    if(frameX < 1674 && objectStyle.indexOf("National") !== -1) {
        // If we've determined that there are 2 STs in this panel,
        // then the left is total number of ST - 1; if not, then it's just total number of ST
        if (numOfSTOnThisPanel === 2) {
            return "ST" + zFill(stCount - 1, 2);
        }

        return "ST" + zFill(stCount, 2);
    
    } else if(frameX >= 1674 && objectStyle.indexOf("National") !== -1) {
        return "ST" + zFill(stCount, 2);
    }

    // Tertiary
    // if((frameX === 276 && frameY === 4977) || (frameX === 315 && frameY === 5046)) {
    //     return "TT01";
    
    // } else if((frameX === 1949 && frameY === 4977) || (frameX === 1392 && frameY === 4977) || (frameX === 1989 && frameY === 5046) || (frameX === 1431 && frameY === 5046)) {
    //     return "TT02";
    
    // } else if((frameX === 2508 && frameY === 4977) || (frameX === 2547 && frameY === 5046)) {
    //     return "TT03";
    // }

    return "no label yet";
}