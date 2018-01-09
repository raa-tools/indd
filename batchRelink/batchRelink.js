#target "InDesign-8.0"

/*
Relinks all document link to a new folder
Currently file names are G####.ext & extension is set to ".tiff"
*/

var panelFolder = Folder.selectDialog("Pink panel folder");
var relinkFolder = Folder.selectDialog("Pick new link folder");

var panelFiles = panelFolder.getFiles("*.indd");

var ext = ".tiff";
var badPanels = [];

for(var j = 0; j < panelFiles.length; j++) {
    var doc = app.open(panelFiles[j], false);
    var badImages = []; var errorHappened = false;

    for(var i = 0; i < doc.links.length; i++) {
        var gNum = doc.links[i].name.slice(0, 5);
        
        try {
            var newLink = new File(relinkFolder + "/" + gNum + ext)
            doc.links[i].relink(newLink);

        } catch (error) {
            errorHappened = true;
            var badDoc = doc.name.split(".")[0];
            badImages.push(gNum);
        }
    }
    
    if(errorHappened) {
        badPanels.push(badDoc + ": " + badImages.join(", "));
    }
    
    doc.save();
    doc.close();

}

if(errorHappened) {
    alert("Some images were not re-linked\r See batchRelinkLog.txt on Desktop.");
    
    var logFile = new File("~/Desktop/batchRelinkLog.txt");
    logFile.encoding = "UTF-8";
    
    logFile.open("w");
    logFile.write(badPanels.join("\n"));
    logFile.close();
}