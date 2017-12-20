/*
A "batch" version of page dimensions slug info updater.

Still requires each file to have a variable text item called "Dimensions",
but this script will auto-update all .indd files in a folder.
*/

#target "InDesign-8.0"

var lib = (File($.fileName)).parent.parent + "/_lib/";
$.evalFile(lib + "getNameFromPath.js");
$.evalFile(lib + "getExtension.js");

var panelFolder = Folder.selectDialog("Select Panels");

if(panelFolder === null) {
    alert("No folder selected", "Nope");
    
} else {
    var panelFiles = panelFolder.getFiles();

    for(var i = 0; i < panelFiles.length; i++) {
        var fileName = getNameFromPath(paneFiles[i]);
        
        if(getExtension(fileName) === ".indd") {
            var doc = app.open(panelFiles[i], true);
        
            var v = doc.textVariables.item("Dimensions");
        
            if (v.isValid && v.variableType == VariableTypes.CUSTOM_TEXT_TYPE){
                v.variableOptions.contents = Math.round(1000*app.activeDocument.documentPreferences.pageWidth)/1000+" x "+Math.round(1000*app.activeDocument.documentPreferences.pageHeight)/1000;
            
            } else{
                alert ('Variable "Dimensions" doesn\'t exist or is of the wrong type');
            }

            doc.save();
            doc.close();
        }
    }
}
