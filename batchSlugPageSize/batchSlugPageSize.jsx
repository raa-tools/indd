/*
A "batch" version of page dimensions slug info updater.

Still requires each file to have a variable text item called "Dimensions",
but this script will auto-update all .indd files in a folder.
*/

#target InDesign

var panelFolder = Folder.selectDialog("Select Panels");

if(panelFolder === null) {
    alert("No folder selected", "Nope");
    
} else {
    var panelFiles = panelFolder.getFiles("*.indd");

    for(var i = 0; i < panelFiles.length; i++) {
        var doc = app.open(panelFiles[i], true);

        var varText = doc.textVariables.item("Dimensions");

        // Check if variable text item exists and is the right type
        // If not, add one
        if(!varText.isValid || varText.variableType !== VariableTypes.CUSTOM_TEXT_TYPE) {
            varText = doc.textVariables.add();
            varText.variableType = VariableTypes.CUSTOM_TEXT_TYPE;
            varText.name = "Dimensions";
        }
        
        // Either way, insert content here
        varText.variableOptions.contents = Math.round(1000*app.activeDocument.documentPreferences.pageWidth)/1000+" × "+Math.round(1000*app.activeDocument.documentPreferences.pageHeight)/1000;
        
        doc.save();
        doc.close();
    }
}
