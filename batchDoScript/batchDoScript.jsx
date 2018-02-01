#target "InDesign-8.0"

try {
    selectFile();

} catch(error) {}


// This seems really ugly...
function selectFile(){
    var scriptToRun = File.openDialog("Select script to run");

    if(scriptToRun.name.split(".")[1] !== ("js" || "jsx")) {
        alert("Can't run that here");
    
    } else {
        try {
            main();    
    
        } catch(error) {
            alert("No folder selected");
        }
    }
}

function main() {
    var panelFolder = Folder.selectDialog("Pick panel folder");
    var panelFiles = panelFolder.getFiles("*.indd");
    
    for(var fileIndex = 0; fileIndex < panelFiles.length; fileIndex++) {
        var batchDoc = app.open(panelFiles[fileIndex]);
        app.doScript(scriptToRun, ScriptLanguage.JAVASCRIPT);
    
        batchDoc.save();
        batchDoc.close();
    }
}