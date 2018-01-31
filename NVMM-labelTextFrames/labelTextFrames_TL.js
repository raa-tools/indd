#target "InDesign-8.0"

try {
    // Library dependencies
    var lib = (File($.fileName)).parent.parent + "/_lib/";
    $.evalFile(lib + "zFill.js");
    
    var panelFolder = Folder.selectDialog("Pick Folder");
    var panelFiles = panelFolder.getFiles("*.indd");
    
    // Declaring some global variables so we don't have to pass them
    // from function to function later
    var panelST; var panelTT;
    var totalST; var totalTT;
    
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
    var panelTopic = "";

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
        
        var textFrames = doc.layers.item("TEXT").textFrames;
    
        // Count
        // Has to be separated because the script has to "understand"
        // the panel before applying labels
        for(var z = 0; z < textFrames.length; z++) {
            var frameX = Math.round(textFrames[z].geometricBounds[1]);
            var objectStyle = textFrames[z].appliedObjectStyle.name;

            countTexts(frameX, objectStyle);
        }

        $.writeln([panelST, panelTT]);

        // Label
        for(var j = 0; j < textFrames.length; j++) {
            var frameX = Math.round(textFrames[j].geometricBounds[1]); 
            var frameY = Math.round(textFrames[j].geometricBounds[0]);
            var objectStyle = textFrames[j].appliedObjectStyle.name;
            
            if (objectStyle.indexOf("National") !== -1) {
                textFrames[j].label = getSTLabel(frameX);
            
            } else if(objectStyle.indexOf("Veterans") !== -1) {
                textFrames[j].label = getTTLabel(frameX);
            
            } else {
                textFrames[j].label = getOtherLabel(objectStyle);
            }
        }
    
        doc.save();
        doc.close();
    }
}


// Checks how many STs & TTs there are by counting titles
// (there's always 1 title per group)
// Tracking total count for sequencing; panel count for labeling
function countTexts(frameX, objectStyle) {
    if(objectStyle === "National Title") {
        totalST++;
        panelST++;

    } else if(objectStyle === "Veterans Title") {
        totalTT++;
        panelTT++;
    }
}

function getOtherLabel(objectStyle) {
    // Primary; not labelling title's textframe right now
    if(objectStyle.indexOf("Conflict") !== -1 && objectStyle !== "Conflict TItle") {
        return "PT01";
    
    // Who Serve
    } else if(objectStyle === "Who Served") {
        return "WS01"
    }

    return "no label"
}

function getSTLabel(frameX) {
    // If there are 2 STs, the left one is always ST total - 1
    // otherwise just return ST total
    if(panelST === 2 && frameX < 1674) {
        return "ST" + zFill(totalST - 1, 2);    
    }

    // Single ST = same case as right ST
    return "ST" + zFill(totalST, 2);
}

function getTTLabel(frameX) {
    // Samep principle of getSTLabel, but with 3 columns
    if(panelTT === 3){
        if(frameX < 1390) {
            return "TT" + zFill(totalTT - 2, 2);
        
        } else if(frameX >= 1390 && frameX < 2507) {
            return "TT" + zFill(totalTT - 1, 2);
        }
    
    // Only 2 TTs — just like STs
    } else if(panelTT === 2 && frameX < 1940) {   
        return "TT" + zFill(totalTT - 1, 2);
    }
    
    // Single TT = same case as right TT
    return "TT" + zFill(totalTT, 2);
}
