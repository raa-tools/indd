#target InDesign

var switchColor = function(oldSwatchName, newSwatchName) {
  var pages = app.activeDocument.pages;
  var newSwatch = app.activeDocument.swatches.itemByName(newSwatchName)

  for(var i = 0; i < pages.length; i++) {
    var pageItems = pages[i].allPageItems;

    for(var j = 0; j < pageItems.length; j++) {
      if(!(pageItems[j] instanceof GraphicLine)) continue;
 
      if(pageItems[j].strokeColor.name === oldSwatchName) {
        pageItems[j].strokeColor = newSwatch
      }
    }
  }
}

switchColor("Paper", "C=0 M=100 Y=0 K=0")