#target "InDesign-8.0"

var scriptFolder = File("~/Library/Preferences/Adobe InDesign/Version 8.0/en_US/Scripts/Scripts Panel");    
var scriptToRun = scriptFolder.openDlg("Select script to run", filter, false);

// Only run when user picks a script
if(scriptToRun !== null) {
    try {
        main();

    } catch(error) {
        alert("No folder selected");
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

function filter(file) {
    if (file.constructor.name == "Folder") {
        return true
    
    } else if (file.name.slice(-3) === ".js" || file.name.slice(-3) === "jsx") {
        return true;
    }
    
    return false;
}