/*
RUN WITH ROADRUNNER
*/

#target "InDesign-8.0"

var doc = app.activeDocument;

var textFrames = doc.textFrames;

for(var i = 0; i < textFrames.length; i++) {
    textFrames[i].label = "";
}
