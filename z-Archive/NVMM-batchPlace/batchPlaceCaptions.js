#target "InDesign-8.0"

var panelFolder  = Folder.selectDialog("Pick Panel Folder");
var scriptFolder = Folder.selectDialog("Pick Scripts Folder");

if(panelFolder === null || scriptFolder === null) {
    alert("No folder selected", "Nope");
    
} else {
    var panelFiles = panelFolder.getFiles("*.indd");
    var scriptFiles = scriptFolder.getFiles("*.txt");
    
    app.clearOverridesWhenApplyingStyle = true;

    app.textImportPreferences.characterSet = TextImportCharacterSet.UTF8;
    app.textImportPreferences.stripReturnsBetweenLines = true;

    for(var j = 0; j < panelFiles.length; j ++) {

        var doc = app.open(panelFiles[j], false);
    
        var panel = {
            exhibit : doc.name.split("_")[0],
            topic   : doc.name.split("_")[1],
            panel   : doc.name.split("_")[2]
        };
        
        var textBoxes = doc.textFrames;
        
        for(var i = 0; i < textBoxes.length; i++) {    
            var objectStyle = textBoxes[i].appliedObjectStyle;
            
            if(textBoxes[i].label === "caption") {
    
                var scriptFileName = panel.exhibit + "_" + panel.topic + "_CP.txt";
                
                textBoxes[i].contents = "";
                textBoxes[i].place(File(scriptFolder + "/" + scriptFileName));
                textBoxes[i].applyObjectStyle(objectStyle, true);
            }
        }
    
        doc.save();
        doc.close();
        
    }
}