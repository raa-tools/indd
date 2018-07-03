﻿#target "InDesign-8.0"

var pages = app.activeDocument.pages

var outlineText = function(item) {
  if(item.itemLayer.name === "Code and info" || !(item instanceof TextFrame)) {
    return
  }
  item.createOutlines();
}

for(var i = 0; i < pages.length; i ++) {
  var pageItems = pages[i].allPageItems;

  for(var j = 0; j < pageItems.length; j++) {
    outlineText(pageItems[j])
  }
}

