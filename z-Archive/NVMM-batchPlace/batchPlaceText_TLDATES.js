#target "InDesign-8.0"

var lib = (File($.fileName)).parent.parent + "/_lib/";
$.evalFile(lib + "getNameFromPath.js");
$.evalFile(lib + "getExtension.js");

var panelFolder  = Folder.selectDialog("Pick Panel Folder");
var scriptFolder = Folder.selectDialog("Pick Scripts Folder");

if(panelFolder === null || scriptFolder === null) {
    alert("No folder selected", "Nope");
    
} else {
    var panelFiles = panelFolder.getFiles();
    var scriptFiles = scriptFolder.getFiles();
    
    app.textImportPreferences.characterSet = TextImportCharacterSet.UTF8;
    app.textImportPreferences.stripReturnsBetweenLines = true;

    for(var j = 0; j < panelFiles.length; j ++) {
        var panelFileName = getNameFromPath(panelFiles[j]);
        var panelCode = panelFileName.split(".")[0];

        var panel = {
            exhibit : panelCode.split("_")[0],
            topic   : panelCode.split("_")[1],
            panel   : panelCode.split("_")[2]
        };

        if(getExtension(panelFileName) === ".indd") {
            var doc = app.open(panelFiles[j], false);

            var dateFile = panel.exhibit + "_" + panel.topic + ".txt";

            var textBoxes = doc.textFrames;
            
            for(var i = 0; i < textBoxes.length; i++) {
                var objectStyle = textBoxes[i].appliedObjectStyle

                if(objectStyle.name === "Conflict Date"){
                    fillTextBox(i, dateFile, objectStyle)
                }
            }
        
            doc.save();
            doc.close();
        }
    }
}

function fillTextBox(index, inputFileType, objectStyle){
    textBoxes[index].contents = "";
    textBoxes[index].place(File(scriptFolder + "/" + inputFileType));
    textBoxes[index].applyObjectStyle(objectStyle, true);
}