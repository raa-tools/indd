var doc = app.activeDocument
var usedFonts = doc.fonts;

if(!Folder(doc.filePath + "/italics").exists)  Folder(doc.filePath+"/_italics").create();

for(var i = 0; i < usedFonts.length; i++) {
    var fontWeight = usedFonts[i].name.split("	")[1];
    
    if(fontWeight.toLowerCase().indexOf("italic") !== -1) doc.saveACopy(File(doc.filePath + "/_italics/" +doc.name));
}