/*
Run a script to a folder of files

Previously known as batchDoScript

Needs some UI...
*/


#target "InDesign-8.0"

var BADFILESLIST = []; var MISSINGLAYER;

var scriptFolder = File("~/Library/Preferences/Adobe InDesign/Version 8.0/en_US/Scripts/Scripts Panel");    
var scriptToRun = scriptFolder.openDlg("Select script to run", filter, false);

// Only run when user picks a script
if(scriptToRun !== null) {
    try {
        main();

    } catch(error) {
        // alert("No folder selected");
        $.writeln(error);
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

        $.writeln(MISSINGLAYER);

        if(MISSINGLAYER) {
            // alert('"Code and info" layer missing from files\r See slugUpdateLog.txt on Desktop.');
            writeLogFile(BADFILESLIST);
            $.writeln("missing layer");
        }
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

function writeLogFile(filesList){
    var logFile = new File("~/Desktop/slugUpdateLog.txt");
    logFile.encoding = "UTF-8";
    
    logFile.open("w");
    logFile.write(filesList.join("\n"));
    logFile.close();
}