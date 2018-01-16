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
    
    app.textImportPreferences.characterSet = TextImportCharacterSet.UTF8;
    app.textImportPreferences.stripReturnsBetweenLines = true;

    for(var j = 0; j < panelFiles.length; j ++) {
        if(panel.topic != "EX06" && panel.topic != "EX07" && panel.panel != "GP02") {
            var doc = app.open(panelFiles[j], false);

            // var panelFileName = getNameFromPath(panelFiles[j]);
            // var panelCode = panelFileName.split(".")[0];

            var panel = {
                exhibit : doc.name.split("_")[0],
                topic   : doc.name.split("_")[1],
                panel   : doc.name.split("_")[2]
            };


            var scriptType = chooseScriptType(panel.panel);

            var titleFile = panel.exhibit + "_" + panel.topic + "_" + scriptType + "-T.txt";
            var bodyFile  = panel.exhibit + "_" + panel.topic + "_" + scriptType + "-B.txt";
        
            var textBoxes = doc.textFrames;
            var objectStyle = chooseObjectStyles(panel.panel);
            
            for(var i = 0; i < textBoxes.length; i++) {    
                if(textBoxes[i].appliedObjectStyle == objectStyle.title){
                    fillTextBox(i, titleFile, objectStyle.title);

                } else if (textBoxes[i].appliedObjectStyle == objectStyle.body) {
                    fillTextBox(i, bodyFile, objectStyle.body);

                } else if(textBoxes[i].appliedObjectStyle == objectStyle.section) {
                    fillTextBox(i, titleFile, objectStyle.section);
                }
            }
        
            doc.save();
            doc.close();
        }
    }
}

function chooseScriptType(panelType){
    if(panelType === "GP01") {
        return "IP01";

    } else if(panelType === "GP04") {
        return "PT01";

    } else if(panelType === "GP05"){
        return "ST01";
    }
}

function chooseObjectStyles(panelType){
    if(panelType === "GP01") {
        return {
            section : doc.objectStyles.item("AL Intro SECTION"),
            title   : doc.objectStyles.item("AL Intro TITLE"),
            body    : doc.objectStyles.item("AL Intro BODY")
        };
    
    } else if(panelType === "GP04") {
        return {
            title : doc.objectStyleGroups.item("AL Primary").objectStyles.item("AL Primary TItle"),
            body  : doc.objectStyleGroups.item("AL Primary").objectStyles.item("AL Primary Body")
        };
    
    } else if(panelType === "GP05") {
        return {
            title : doc.objectStyleGroups.item("AL Secondary").objectStyles.item("AL Secondary Title"),
            body  : doc.objectStyleGroups.item("AL Secondary").objectStyles.item("AL Secondary Body")
        };
    }
}

function fillTextBox(index, inputFileType, objectStyle){
    textBoxes[index].contents = "";
    textBoxes[index].place(File(scriptFolder + "/" + inputFileType));
    textBoxes[index].applyObjectStyle(objectStyle, true);
}