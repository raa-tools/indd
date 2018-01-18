﻿#target "InDesign-8.0"

var scriptToRun = new File("/Users/jesentanadi/Dropbox/1-Type/z-Scripts/_JT/3-inddScripts/showImageName/showImageName.js");

var panelFolder = Folder.selectDialog("Pick panel folder");
var panelFiles = panelFolder.getFiles("*.indd");

for(var fileIndex = 0; fileIndex < panelFiles.length; fileIndex++) {
    var batchDoc = app.open(panelFiles[fileIndex]);
    app.doScript(scriptToRun, ScriptLanguage.JAVASCRIPT);

    batchDoc.save();
    batchDoc.close();
}