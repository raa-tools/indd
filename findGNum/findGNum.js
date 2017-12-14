#target "InDesign-8.0"

var findGNumDialog = app.dialogs.add({name:"Find G#"});

with(findGNumDialog.dialogColumns.add()) {
    var gNumEditText = textEditboxes.add({editContents: "g####", minWidth:180});
}

var showDialog = findGNumDialog.show();

if(showDialog === true) {
    findGNum(gNumEditText.editContents.toLowerCase());
}

findGNumDialog.destroy();


function findGNum(gNumInput) {
    var lib = (File($.fileName)).parent.parent + "/functionLib/";
    $.evalFile(lib + "getExtension.js");
    $.evalFile(lib + "getNameFromPath.js");
    
    var docList = [];
    
    var panelFolder = Folder.selectDialog("Select Panel Foder");
    var panelFiles = panelFolder.getFiles();
    
    for(var i = 0; i < panelFiles.length; i++) {
        var fileName = getNameFromPath(panelFiles[i]);
    
        if(getExtension(fileName) === ".indd") {
    
            var doc = app.open(panelFiles[i], false);
    
            for(var j = 0; j < doc.links.length; j++) {
                var gNumLink = doc.links[j].name.slice(0, 5).toLowerCase();
    
                if(gNumLink === gNumInput) {
                    if(docList.join().indexOf(doc.name) === -1){
                        docList.push(doc.name);
                    }
                }  
            }
    
            doc.close();
        }
    }
    
    if(docList.length > 0) {
        alert(docList.join(", "), "Link is here");
    
    } else {
        alert("Link not found", "Nope");
    }
}
