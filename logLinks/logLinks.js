#target "InDesign-8.0"

var doc = app.activeDocument;
var docName = doc.name.split(".indd")

var links = doc.links
var linksNames = []


var logFile = new File("~/Desktop/" + docName[0] + "-links.csv")
logFile.encoding = "UTF-8"
logFile.open("w")

for (var i = 0; i < links.length; i++) {
  logFile.write(links[i].name)
  logFile.write("\n")
}

logFile.close()
