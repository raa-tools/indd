#target "InDesign-8.0"

var pages = app.activeDocument.pages

for(var i = 0; i < pages.length; i ++) {
  var textboxes = pages[i].textFrames

  for(var j = 0; j < textboxes.length; j++) {
    textboxes[j].createOutlines()
  }
}