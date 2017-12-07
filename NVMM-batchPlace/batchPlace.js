var panelFolder  = Folder.selectDialog("Pick Panel Folder");
var scriptFolder = Folder.selectDialog("Pick Scripts Folder");
// var panelFolder  = Folder("/Users/jesentanadi/Desktop/Ohio Test/Indd");
// var scriptFolder = Folder("/Users/jesentanadi/Desktop/Ohio Test/Script/TH/0-Intro/");

if(panelFolder === null || scriptFolder === null) {
    alert("No folder selected", "Nope");

} else if(panelFolder.getFiles().length != scriptFolder.getFiles.length * 2) {
    alert("Number of panels and script elements don't match");

} else {
    var panelFiles = panelFolder.getFiles();

    for(var j = 0; j < panelFiles.length; j ++) {
        if(panelFiles[j].toString().split("/").slice(-1)[0] != ".DS_Store") {

            var doc = app.open(panelFiles[j], false);
        
            var panelCode = doc.name.split(".")[0];
        
            var panel = {
                exhibit : panelCode.split("_")[0],
                topic   : panelCode.split("_")[1],
                panel   : panelCode.split("_")[2]
            };
            
            var titleFile = panel.exhibit + "_" + panel.topic + "_IP01-T.txt";
            var bodyFile  = panel.exhibit + "_" + panel.topic + "_IP01-B.txt";
        
            var textBoxes = doc.textFrames;
        
            var objectStyle = {
                section : doc.objectStyles.item("AL Intro SECTION"),
                title   : doc.objectStyles.item("AL Intro TITLE"),
                body    : doc.objectStyles.item("AL Intro BODY")
            };
            
            for(var i = 0; i < textBoxes.length; i++) {
                if(textBoxes[i].appliedObjectStyle == objectStyle.section) {
                    textBoxes[i].contents = "";
                    textBoxes[i].place(File(scriptFolder + "/" + titleFile));
                    textBoxes[i].applyObjectStyle(objectStyle.section, true);
                    
                } else if(textBoxes[i].appliedObjectStyle == objectStyle.title){
                    textBoxes[i].contents = "";
                    textBoxes[i].place(File(scriptFolder + "/" + titleFile));
                    textBoxes[i].applyObjectStyle(objectStyle.title, true);

                } else if (textBoxes[i].appliedObjectStyle == objectStyle.body) {
                    textBoxes[i].contents = "";
                    textBoxes[i].place(File(scriptFolder + "/" + bodyFile));
                    textBoxes[i].applyObjectStyle(objectStyle.body, true);
                }
            }
        
            doc.save();
            doc.close();
        }
    }
}
// var txtFileList = myFolder.getFiles();

// for(var i = 0; i < txtFileList.length; i++) {
//     var pathList = txtFileList[i].toString().split("/");
    
//     var txtFileName = pathList.slice(-1)[0]

//     var script = {
//         exhibit : txtFileName.split("_")[0],
//         topic   : txtFileName.split("_")[1],
//         content : txtFileName.split("_")[2].split(".")[0]
//     };

//     $.writeln(script.exhibit + "_" + script.topic + "_" + script.content);
// }