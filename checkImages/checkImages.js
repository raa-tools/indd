// Check every image in every file in a folder, recursively
// Currently checks the following:
// - If link is broken or not
// - If images are below THRESHOLD
// - If images are squished

#target "InDesign-8.0"
THRESHOLD = 150;
var LOG_ARRAY = [];

function main() {
  var rootFolder = Folder.selectDialog("Pick root folder");

  recurseTraverse(rootFolder, checkImages);
  writeLogFile("checkImages", LOG_ARRAY);
}


////////////////////////////
// BEGIN HELPER FUNCTIONS //
////////////////////////////

function recurseTraverse(directory, callbackFunc) {
  var files = directory.getFiles("*");

  for (var i = 0; i < files.length; i++) {
    // If file is actually dir, then recurse
    if (typeof files[i].type == "undefined") {
      var folder = new Folder(files[i].relativeURI);
      recurseTraverse(folder, callbackFunc)
    }

    // Only do stuff to indd files
    if (files[i].name.split(".").pop() === "indd") {
      /* $.writeln(typeof files[i]); */
      callbackFunc(files[i]);
    }
  }
}

function checkImages(fileToCheck) {
  var doc = app.open(fileToCheck);
  
  var squishedList;
  var lowResList;

  var squishedList = [];
  var lowResList = [];

  // Check all images against THRESHOLD
  var images = getImages(doc.allGraphics);
  for (var j = 0; j < images.length; j++) {
    var report = analyzeImage(images[j], THRESHOLD);

    // Only add to list if obj property exists
    if (report.squished) squishedList.push(report.squished);
    if (report.lowRes) lowResList.push(report.lowRes);
  }


  if(squishedList.length || lowResList.length ) {
    LOG_ARRAY.push(doc.name + ":");
    if(squishedList.length) {
      LOG_ARRAY.push("squished:");
      for(var squishIndex = 0; squishIndex < squishedList.length; squishIndex++) {
        LOG_ARRAY.push(squishedList[squishIndex]);
      }
    }
    if(lowResList.length) {
      LOG_ARRAY.push("low res:");
      for(var lowResIndex = 0; lowResIndex < lowResList.length; lowResIndex++) {
        LOG_ARRAY.push(lowResList[lowResIndex]);
      }
    }
    LOG_ARRAY.push("\n");
  }

  doc.save();
  doc.close();
}

function getImages(allGraphics) {
  var imgArray = [];
  for (var j = 0; j < allGraphics.length; j++) {
    if(allGraphics[j] instanceof Image) {
      imgArray.push(allGraphics[j]);
    }
  }
  return imgArray;
}

function analyzeImage(image, threshold) {
  /*
  Check if image is squished or is below threshold
  and returns report as an array:
  [squishedReport, lowResReport]
  */
  var xPPI = image.effectivePpi[0];
  var yPPI = image.effectivePpi[1];
  var report = {
    squished: undefined,
    lowRes: undefined
  };
  
  // Check if squished
  if (xPPI !== yPPI) {
    report.squished =  image.itemLink.name.split(".")[0];
  } 

  // Check if below threshold
  if (xPPI < threshold || yPPI < threshold) {
    var scaleBy = Math.ceil(threshold / xPPI * 100);
    report.lowRes = image.itemLink.name.split(".")[0] + " - upres by " + scaleBy + "%";
  }

  return report;
}

function writeLogFile(logTitle, itemsToLog) {
  var logFile = new File("~/Desktop/" + logTitle + ".txt");
  logFile.encoding = "UTF-8";
  logFile.open("w");
  logFile.write(itemsToLog.join("\n"));
  logFile.close();
}

main();

