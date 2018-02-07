#target "InDesign-8.0"

try {
    // Library dependencies
    var lib = (File($.fileName)).parent.parent + "/_lib/";
    $.evalFile(lib + "zFill.js");
    
    var panelFolder = Folder.selectDialog("Pick Folder");
    var panelFiles = panelFolder.getFiles("*.indd");
    
    // Declaring some global variables so we don't have to pass them
    // from function to function later
    var panelCAP; var topRowCAP;
    var totalCAP;
    
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
            continue;
        } 
        
        // Check if panel is within the same panel topic
        // If not, it's because we're at the beginning of a topic, 
        // so reset total counters & remember the topic we're at
        if(panelTopic !== panel.topic) {
            totalCAP = 0;
            panelTopic = panel.topic;
        }
    
        // Reset panel counters per file
        panelCAP = 0; topRowCAP = 0;
        
        var textFrames = doc.layers.item("TEXT").textFrames;
    
        // Count
        // Has to be separated because the script has to "understand"
        // the panel before applying labels
        for(var z = 0; z < textFrames.length; z++) {
            var frameY = Math.round(textFrames[z].geometricBounds[0]);
            var objectStyle = textFrames[z].appliedObjectStyle.name;

            if(objectStyle.indexOf("Captions") !== -1) {
                countTexts(frameY)
            }
        }

        // Label
        for(var j = 0; j < textFrames.length; j++) {
            var frameX = Math.round(textFrames[j].geometricBounds[1]); 
            var frameY = Math.round(textFrames[j].geometricBounds[0]);
            var objectStyle = textFrames[j].appliedObjectStyle.name;
            
            if (objectStyle.indexOf("Captions") !== -1) {
                textFrames[j].label = getCAPLabel(panel.panel, frameX, frameY);
            } 
        }
    
        doc.save();
        doc.close();
    }
}

// Checks how many STs & TTs there are by counting titles
// (there's always 1 title per group)
// Tracking total count for sequencing; panel count for labeling
function countTexts(frameY) {
        totalCAP++;
        panelCAP++;

    if(frameY < 3000) {
        topRowCAP++;
    }
}

function getCAPLabel(panelCode, frameX, frameY) {
    if(panelCode.slice(-1)[0] === "b" || panelCode === "GP01") {
        if(panelCAP === 2 && frameX < 1400) {
            return "CG" + zFill(totalCAP -1, 2);
        }
        return "CG" + zFill(totalCAP, 2);
    }

    if(panelCAP === 5) {
        // Top row
        if(frameY < 3000) {
            if(frameX < 720) {
                return "CG" + zFill(totalCAP - 4, 2);
            }

            return "CG" + zFill(totalCAP - 3, 2);
            
        // Bottom row
        } else {
            if(frameX < 930) {
                return "CG" + zFill(totalCAP - 2, 2);
            
            } else if(frameX < 2100) {
                return "CG" + zFill(totalCAP - 1, 2);   
            }

            return "CG" + zFill(totalCAP, 2);
        }

    } else if(panelCAP === 4) {
        // Top row
        if(frameY < 3000) {
            if(frameX < 720) {
                return "CG" + zFill(totalCAP - 3, 2);
            }
            
            return "CG" + zFill(totalCAP - 2, 2);
        
        // Bottom row
        } else {
            if(frameX < 1500) {
                return "CG" + zFill(totalCAP - 1, 2);
            }
            
            return "CG" + zFill(totalCAP, 2);
        }

    } else if(panelCAP === 3 && topRowCAP === 2) {
        if(frameY < 3000) {
            if(frameX < 720) {
                return "CG" + zFill(totalCAP - 2, 2);
            }
            
            return "CG" + zFill(totalCAP - 1, 2);
        } 

        return "CG" + zFill(totalCAP, 2);
    
    } else if(panelCAP === 3 && topRowCAP === 1) {
        if(frameY < 3000) {
            return "CG" + zFill(totalCAP - 2, 2);
        
        } else {
            if(frameX < 1500) {
                return "CG" + zFill(totalCAP - 1, 2);
            }

            return "CG" + zFill(totalCAP, 2);
        }
    
    } else if(panelCAP === 2) {
        if(frameY < 3000) {
            return "CG" + zFill(totalCAP - 1, 2);
        }
        return "CG" + zFill(totalCAP, 2);
    }

    return "CG" + zFill(totalCAP, 2);
}
