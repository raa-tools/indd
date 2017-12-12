#target "InDesign-8.0"

var panelFolder  = Folder.selectDialog("Pick Panel Folder");
var scriptFolder = Folder.selectDialog("Pick Scripts Folder");

if(panelFolder === null || scriptFolder === null) {
    alert("No folder selected", "Nope");
    
} else {
    var panelFiles = panelFolder.getFiles();
    var scriptFiles = scriptFolder.getFiles();
    
    app.clearOverridesWhenApplyingStyle = true;

    app.textImportPreferences.characterSet = TextImportCharacterSet.UTF8;
    app.textImportPreferences.stripReturnsBetweenLines = true;

    for(var j = 0; j < panelFiles.length; j ++) {
        var panelCode = getNameFromPath(panelFiles[j]).split(".")[0];
        var fileExt = getNameFromPath(panelFiles[j]).split(".")[1];

        var panel = {
            exhibit : panelCode.split("_")[0],
            topic   : panelCode.split("_")[1],
            panel   : panelCode.split("_")[2]
        };

        if(fileExt === "indd") {
            var doc = app.open(panelFiles[j], false);
        
            var textBoxes = doc.textFrames;
            
            for(var i = 0; i < textBoxes.length; i++) {    
                var objectStyle = textBoxes[i].appliedObjectStyle;

                var story = {
                    code : textBoxes[i].label,
                    ext  : getScriptExt(objectStyle.name)
                };             

                var scriptFile = panel.exhibit + "_" + panel.topic + "_" + story.code + story.ext;
                
                if(story.code !== undefined && story.ext !== undefined && story.code !== "" && story.ext !== ""){
                    placeText(i, panel.topic, scriptFile, objectStyle);
                }
            }
        
            doc.save();
            doc.close();
        }
    }
}

function getNameFromPath(inputPath){
    return inputPath.toString().split("/").slice(-1)[0];
}

function getScriptExt(objectStyleName){
    if(objectStyleName.indexOf("Title") !== -1) {
        return "-T.txt"

    } else if(objectStyleName.indexOf("Body") !== -1) {
        return "-B.txt"
    }
}

function placeText(index, topicFolder, inputFile, objectStyle){
    textBoxes[index].contents = "";
    textBoxes[index].place(File(scriptFolder + "/" + topicFolder + "/" + inputFile));
    textBoxes[index].applyObjectStyle(objectStyle, true);
}