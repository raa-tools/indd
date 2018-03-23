#target "InDesign-8.0"

var links = app.activeDocument.links;

var linksArray = links.everyItem().name;

for(var i = 0; i < linksArray.length; i++) {
  linksArray[i] = linksArray[i].split(".")[0];
}

var logFile = new File("~/Desktop/links.txt");
logFile.encoding = "UTF-8";

logFile.open("w");
logFile.write(linksArray.join("\n"));
logFile.close();