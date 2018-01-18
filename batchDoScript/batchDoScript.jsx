#target "InDesign-8.0"

var scriptToRun = new File("/Users/jesentanadi/Library/Preferences/Adobe InDesign/Version 8.0/en_US/Scripts/Scripts Panel/batch FnR/batch-find-and-replace.jsx");

var panelFolder = Folder.selectDialog("Pick panel folder");
var panelFiles = panelFolder.getFiles("*.indd");

for(var i = 0; i < panelFiles.length; i++) {
    var doc = app.open(panelFiles[i]);
    app.doScript(scriptToRun, ScriptLanguage.JAVASCRIPT);

    doc.save();
    doc.close();
}