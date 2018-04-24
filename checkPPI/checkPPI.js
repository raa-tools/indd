#target "InDesign-8.0"
var THRESHOLD = 150;

function getImages(allGraphics) {
  var imgArray = [];
  for (var _i = 0, allGraphics_1 = allGraphics; _i < allGraphics_1.length; _i++) {
      var graphic = allGraphics_1[_i];
      if (graphic instanceof Image) {
          imgArray.push(graphic);
      }
  }
  return imgArray;
}

function checkPPI(image, threshold) {
  function checkForSquish(x, y) {
      return x !== y;
  }

  function checkThreshold(x) {
      return x < threshold;
  }  

  var xPPI = image.effectivePpi[0];
  var yPPI = image.effectivePpi[1];
  
  var squished = checkForSquish(xPPI, yPPI);
  var belowThreshold = checkThreshold(xPPI);
  if (squished) {
    squishedList.push(image.itemLink.name.split(".")[0])
  }
  
  if (belowThreshold) {
    var scaleBy = Math.ceil(threshold / xPPI * 100);
    lowResList.push(image.itemLink.name.split(".")[0] + " - upres by " + scaleBy + "%")
  }
}

function writeLogFile(logTitle, itemsToLog) {
  var logFile = new File("~/Desktop/" + logTitle + ".txt");
  logFile.encoding = "UTF-8";
  logFile.open("w");
  logFile.write(itemsToLog.join("\n"));
  logFile.close();
}

var panelFolder = Folder.selectDialog("Pick panel folder");
var panelFiles = panelFolder.getFiles("*.indd");

var logArray = []

for(var fileIndex = 0; fileIndex < panelFiles.length; fileIndex++) {
  var doc = app.open(panelFiles[fileIndex]);
  
  var squishedList = [];
  var lowResList = [];

  var images = getImages(doc.allGraphics);
  for (var _i = 0, images_1 = images; _i < images_1.length; _i++) {
      var image = images_1[_i];
      checkPPI(image, THRESHOLD);
  }

  
  if(squishedList.length || lowResList.length) {
    logArray.push(doc.name + ":");
    if(squishedList.length) {
      logArray.push("squished:");
      for(var squishIndex = 0; squishIndex < squishedList.length; squishIndex++) {
        logArray.push(squishedList[squishIndex]);
      }
    }
    if(lowResList.length) {
      logArray.push("low res:");
      for(var lowResIndex = 0; lowResIndex < lowResList.length; lowResIndex++) {
        logArray.push(lowResList[lowResIndex]);
      }
    }
    logArray.push("\n");
  }

  doc.save();
  doc.close();
}

writeLogFile("checkPPI", logArray);
