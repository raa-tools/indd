/*
Run a script to a folder of files

Previously known as batchDoScript

Needs some UI...
*/


#target "InDesign-8.0"

// Some global variables that can be used by the script being run
// Not sure if best practice, but right now it's one way to log stuff...
BADFILESLIST = [];
MISSINGLAYER = false;

// For dev cycle, use this instead of having to pick a script to run
// var scriptToRun = File("/Users/jesentanadi/Dropbox/3-Scripts/RAATools/1-inddScripts/NVMM-slugger/NVMMSlugSetup.jsx");

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

        if(MISSINGLAYER) {
            alert('"Code and info" layer missing from files\r See roadRunnerLog.txt on Desktop.');
            writeLogFile(BADFILESLIST);
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

function writeLogFile(listToOutput){
    var logFile = new File("~/Desktop/roadRunnerLog.txt");
    logFile.encoding = "UTF-8";
    
    logFile.open("w");
    logFile.write("These panels didn't quite work out:\n");
    logFile.write(listToOutput.join("\n"));
    logFile.close();
}