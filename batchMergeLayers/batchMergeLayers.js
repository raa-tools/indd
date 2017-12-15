/*
Replace dates in TL panels with PDFs.

Maybe generalize this script for other uses?
*/

#target "InDesign-8.0"

var lib = (File($.fileName)).parent.parent + "/_lib/";
$.evalFile(lib + "getNameFromPath.js");
$.evalFile(lib + "getExtension.js");

var panelFolder = Folder.selectDialog("Select Panel Folder");

var panelFiles = panelFolder.getFiles();

var layer1Name = "TEXT-1";
var layer2Name = "TEXT-DP";

for(var i = 0; i < panelFiles.length; i++){
    var fileName = getNameFromPath(panelFiles[i]);
    
    if(getExtension(fileName) === ".indd"){

        var doc = app.open(panelFiles[i], false);
        var layer1There = false;
        var layer2There = false;
        
        for(var j = 0; j < doc.layers.length; j++) {
            if(doc.layers[j].name === layer1) {
                layer1There = true;
            
            } else if(doc.layers[j].name === layer2) {
                layer2There = true;
            }
        }

        if(layer1There && layer2There) {
            var layer1 = doc.layers.item(layer1Name);
            var layer2 = doc.layers.item(layer2Name);
    
            layer1.merge(layer2);
            
            doc.save();
            doc.close();
        
        // } else if(!layer1There && !layer2There) {
        //     alert(layer1Name + " & " + layer2Name + " missing")
        
        } else if(!layer1There){
            alert(layer1Name + " missing");
        
        } else if(!layer2There){
            alert(layer2Name + " missing")
        }
        
    
    }
}



