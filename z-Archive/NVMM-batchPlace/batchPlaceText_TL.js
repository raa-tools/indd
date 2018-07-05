#target "InDesign-8.0"

var lib = (File($.fileName)).parent.parent + "/_lib/";
$.evalFile(lib + "getNameFromPath.js");

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
        // var panelCode = getNameFromPath(panelFiles[j]).split(".")[0];
        var panelCode = doc.name.split(".")[0];

        var panel = {
            exhibit : panelCode.split("_")[0],
            topic   : panelCode.split("_")[1],
            panel   : panelCode.split("_")[2]
        };

        var textBoxes = doc.layers.item("TEXT").textFrames;
        
        for(var i = 0; i < textBoxes.length; i++) {    
            var objectStyle = textBoxes[i].appliedObjectStyle;

            var story = {
                code : textBoxes[i].label,
                ext  : getScriptExt(textBoxes[i].label, objectStyle.name)
            };             

            var scriptFile = panel.exhibit + "_" + panel.topic + "_" + story.code + story.ext;
            
            if(story.code !== (undefined || "" ) && (story.ext !== undefined  || "")) {
                // Only doing Who Served
                if(story.code.indexOf("WS") !== -1) {
                    placeText(i, scriptFile, objectStyle);
                }
            }
        }
    
        doc.save();
        doc.close();
        
    }
}

function getScriptExt(scriptLabel, objectStyleName){
    if(scriptLabel === "TI01") {
        return ".txt";
    
    } else if(scriptLabel === "WS01") {
        return "-B.txt"
    }

    if(objectStyleName.indexOf("Title") !== -1 || objectStyleName.indexOf("TItle") !== -1) {
        return "-T.txt";

    } else if(objectStyleName.indexOf("Body") !== -1) {
        return "-B.txt";
    }
    
}

function placeText(index, inputFile, objectStyle){
    with(textBoxes[index]) {
        contents = "";
        place(File(scriptFolder + "/" + inputFile));
        applyObjectStyle(objectStyle, true);
        parentStory.appliedCharacterStyle = doc.characterStyles.item("[None]");
        parentStory.clearOverrides();
    }
}