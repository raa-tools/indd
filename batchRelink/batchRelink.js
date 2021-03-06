﻿#target "InDesign-8.0"

/*
Relinks all document link to a new folder
Currently file names are G####.ext & extension is set to ".tiff"
*/

var panelFolder = Folder.selectDialog("Pick panel folder");
var relinkFolder = Folder.selectDialog("Pick new link folder");

var panelFiles = panelFolder.getFiles("*.indd");

var NEW_EXT = ".tif";
var badPanels = [];
var writeLog = false; 

// Progress bar
var w = new Window("palette");
w.progressBar = w.add ('progressbar', undefined, 0, panelFiles.length);
w.progressBar.preferredSize.width = 300;
w.show();

for(var j = 0; j < panelFiles.length; j++) {
    var doc = app.open(panelFiles[j], false);
    var badImages = []; var errorHappened = false;
    
    w.progressBar.value = j+1;

    for(var i = 0; i < doc.links.length; i++) {
        var fileName = doc.links[i].name.split(".")[0]
        var fileExt = doc.links[i].name.split(".")[1];

        try {
            var newLink = new File(relinkFolder + "/" + fileName + NEW_EXT);
            doc.links[i].relink(newLink);
        
        // Raise flags when file isn't found & log g# 
        } catch (error) {
            errorHappened = true;
            writeLog = true;
            badImages.push(doc.links[i]);
        }
    }
    
    // Log panel code & missing g#s in that panel
    if(errorHappened) {
        var badDoc = doc.name.split(".")[0];
        badPanels.push(badDoc + ": " + badImages.join(", "));
    }
    
    doc.save();
    doc.close();
}

// Write a .txt log to list panels with missing g#s
if(writeLog) {
    alert("Some images were not re-linked\r See batchRelinkLog.txt on Desktop.");
    
    var logFile = new File("~/Desktop/batchRelinkLog.txt");
    logFile.encoding = "UTF-8";
    
    logFile.open("w");
    logFile.write(badPanels.join("\n"));
    logFile.close();
}