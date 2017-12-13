#target "InDesign-8.0"

/*
Relinks all document link to a new folder
Currently file names are G####.ext & extension is set to ".tif"
*/


var lib = (File($.fileName)).parent.parent + "/functionLib/";
$.evalFile(lib + "getExtension.js");
$.evalFile(lib + "getNameFromPath.js");

var panelFolder = Folder.selectDialog("Pink panel folder");
var relinkFolder = Folder.selectDialog("Pick new link folder");

var panelFiles = panelFolder.getFiles();

var ext = ".tif";
var badPanels = [];

for(var j = 0; j < panelFiles.length; j++) {
    var fileName = getNameFromPath(panelFiles[j]);
    
    if(getExtension(fileName) === ".indd") {
        var doc = app.open(panelFiles[j]);
        var doc = app.activeDocument;
        var badImages = [];

        for(var i = 0; i < doc.links.length; i++) {
            var gNum = doc.links[i].name.slice(0,5);
            // var ext = getExtension(doc.links[i].name);
            
            try {
                var newLink = new File(relinkFolder + "/" + gNum + ext)
                doc.links[i].relink(newLink);

            } catch (error) {
                var badDoc = doc.name.split(".")[0];
                badImages.push(gNum);
            }
        }
        
        badPanels.push(badDoc + ": " + badImages);
        
        doc.save();
        doc.close();
    }

}

for(var z = 0; z < badPanels.length; z++) {
    $.writeln(badPanels[z] + "\n");
}

