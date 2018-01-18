#target "InDesign-8.0"

var panelFolder  = Folder.selectDialog("Pick Panel Folder");

if(panelFolder === null) {
    alert("No folder selected", "Nope");
    
} else {
    var panelFiles = panelFolder.getFiles("*.indd");
    
    for(var j = 0; j < panelFiles.length; j ++) {
        var doc = app.open(panelFiles[j], true);

        var bodyObjectStyle = doc.objectStyles.item("DL Body");
        var dateObjectStyle = doc.objectStyles.item("DL Date");

        var textBoxes = doc.layers.item("TEXT").textFrames;

        for(var i = 0; i < textBoxes.length; i++) {
            if(textBoxes[i].label.indexOf("main") !== -1) {
                textBoxes[i].applyObjectStyle(bodyObjectStyle);
            
            } else if(textBoxes[i].label.indexOf("date") !== -1) {
                textBoxes[i].applyObjectStyle(dateObjectStyle);
            }
        }
    
        doc.save();
        doc.close();

    }
}