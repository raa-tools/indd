#target "InDesign-8.0"

var scriptToRun = File.openDialog("Select script to run");

if(scriptToRun.name.slice(".")[1] !== ("js" || "jsx")) {
    alert("Can't run that here");

} else {
    main();    
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