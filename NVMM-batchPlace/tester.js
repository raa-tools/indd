var doc = app.activeDocument;

var textBoxes = doc.textFrames;

for(var i = 0; i < textBoxes.length; i++) {    
    var storyCode = textBoxes[i].label;
    
    var objectStyle = textBoxes[i].appliedObjectStyle;

    if(objectStyle.name.indexOf("Title") !== -1) {
        $.writeln("Title in here")
    } else if(objectStyle.name.indexOf("Body") !== -1) {
        $.writeln("Body in here")
    }
}