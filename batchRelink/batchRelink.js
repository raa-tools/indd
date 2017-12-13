#target "InDesign-8.0"

/*
Relinks all document link to a new folder
Currently extension is set to ".tif"
*/


var lib = (File($.fileName)).parent.parent + "/functionLib/";
$.evalFile(lib + "getExtension.js");
$.evalFile(lib + "checkExtension.js");
$.evalFile(lib + "getNameFromPath.js");

var panelFolder = Folder.selectDialog("Pink panel folder");
var relinkFolder = Folder.selectDialog("Pick new link folder");

var panelFiles = panelFolder.getFiles();

var ext = ".tif";

for(var j = 0; j < panelFiles.length; j++) {
    var fileName = getNameFromPath(panelFiles[j]);
    
    $.writeln(checkExtension(fileName, ".indd"));
    // if(checkExtension(panelFiles[j], ".indd")) {
    //     var doc = app.open(panelFiles[j]);
        
    //     for(var i = 0; i < doc.links.length; i++) {
    //         var gNum = doc.links[i].name.slice(0,5);
    //         // var ext = getExtension(doc.links[i].name);
        
    //         doc.links[i].relink(new File(relinkFolder + "/" + gNum + ext));
    //         $.writeln(decodeURI(relinkFolder) + "/" + gNum + ext);
    //     }

    // }
}
