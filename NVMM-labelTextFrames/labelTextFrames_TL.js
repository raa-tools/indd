#target "InDesign-8.0"

try {
    // Library dependencies
    var lib = (File($.fileName)).parent.parent + "/_lib/";
    $.evalFile(lib + "zFill.js");
    
    var panelFolder = Folder.selectDialog("Pick Folder");
    var panelFiles = panelFolder.getFiles("*.indd");
    
    var panelTopic = "";
    var panelST; var panelTT;
    var totalST; var totalTT;
    var midTT;
    
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
            totalST = 0;
            totalTT = 0;
            panelTopic = panel.topic;
        }
    
        // Reset counters and flags per file
        panelST = 0; panelTT = 0;
        midTT = false;
        
        var textFrames = doc.layers.item("TEXT").textFrames;
    
        // Count
        // Has to be separated because the script has to "understand"
        // the panel before applying labels
        for(var z = 0; z < textFrames.length; z++) {
            var objectStyle = textFrames[z].appliedObjectStyle.name;
            
            countTexts(objectStyle);
        }

        $.writeln(panelST, panelTT);
        // Label
        // for(var j = 0; j < textFrames.length; j++) {
        //     textFrames[j].label = getLabel(textFrames[j], numOfTextsOnThisPanel, totalST, totalTT);
        // }
    
        doc.save();
        doc.close();
    }
}


// Checks how many STs & TTs there are by counting titles
// (there's always 1 title per group)
// Tracking total count for sequencing; panel count for labeling
function countTexts(objectStyle) {
    if(objectStyle === "National Title") {
        totalST++;
        panelST++;

    } else if(objectStyle === "Veterans Title") {
        totalTT++;
        panelTT+;
    }
}

function getLabel(textFrame, stCount, ttCount) {
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
        if(panelST === 2) {
            return "ST" + zFill(stCount - 1, 2);
        }

        return "ST" + zFill(stCount, 2);
    
    } else if(frameX >= 1674 && objectStyle.indexOf("National") !== -1) {
        return "ST" + zFill(stCount, 2);
    }

    // Tertiary
    // if(frameX < 1392 && objectStyle.indexOf("Veterans") !== -1) {
    //     if(panelCount[1] === 3) {
    //         return "TT" + zFill(ttCount - 2, 2);
        
    //     } else if(panelCount[1] === 2 && leftTT) {
    //         return "TT" + zFill(ttCount - 1, 2);
    //     }

    // } else if() {

    // }


    // if((frameX === 276 && frameY === 4977) || (frameX === 315 && frameY === 5046)) {
    //     return "TT01";
    
    // } else if((frameX === 1949 && frameY === 4977) || (frameX === 1392 && frameY === 4977) || (frameX === 1989 && frameY === 5046) || (frameX === 1431 && frameY === 5046)) {
    //     return "TT02";
    
    // } else if((frameX === 2508 && frameY === 4977) || (frameX === 2547 && frameY === 5046)) {
    //     return "TT03";
    // }

    return "no label yet";
}