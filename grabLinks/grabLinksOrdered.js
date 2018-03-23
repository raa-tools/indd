#target "InDesign-8.0"

var pages = app.activeDocument.pages;

var gNums = [];

for(var i = 0; i < pages.length; i++) {
  var pageItems = pages[i].pageItems.everyItem().getElements();
  
  for(var j = 0; j < pageItems.length; j++) {
    if(pageItems[j] instanceof Rectangle) {
      var imageName = pageItems[j]
        .images
        .item(0)
        .itemLink
        .name
        .split(".")[0]
    }
  }
}

$.writeln(gNums);

var logFile = new File("~/Desktop/orderedLinks.txt");
logFile.encoding = "UTF-8";

logFile.open("w");
logFile.write(gNums.join("\n"));
logFile.close();