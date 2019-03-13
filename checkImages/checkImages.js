/*
Check every image in every file in a folder, recursively
Currently checks the following:
  - If link is broken or not
  - If images are below THRESHOLD
  - If images are squished
*/

#target "InDesign-8.0"
THRESHOLD = 150;
var LOG_ARRAY = [];
var COUNT = 0;

function main() {
  var oldInteractionPref = app.scriptPreferences.userInteractionLevel;
  app.scriptPreferences.userInteractionLevel =UserInteractionLevels.NEVER_INTERACT;

  var rootFolder = Folder.selectDialog("Pick root folder");

  recurseTraverse(rootFolder, function() {
    COUNT++;
  });

  var w = new Window("palette");
  pbar = w.add("progressbar", undefined, 0, COUNT);
  pbar.preferredSize.width = 300;
  w.show();

  recurseTraverse(rootFolder, analyzeFile);
  writeLogFile("checkImages", LOG_ARRAY);

  app.scriptPreferences.userInteractionLevel = oldInteractionPref; // reset to old pref
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
      callbackFunc(files[i]);
    }
  }
}

function analyzeFile(fileToCheck) {
  var doc = app.open(fileToCheck);
  var folderName = doc.filePath
    .absoluteURI
    .split("/")
    .pop();
  var images = getImages(doc.allGraphics);

  var missingLinks = checkLinks(doc);
  var squishedImages = [];
  var lowResImages = [];

  for (var imgIndex = 0; imgIndex < images.length; imgIndex++) {
    var squished = checkSquish(images[imgIndex]);
    var lowRes = checkRes(images[imgIndex])

    if (squished) squishedImages.push(squished);
    if (lowRes) lowResImages.push(lowRes);
  }

  if(missingLinks.length || squishedImages.length || lowResImages.length) {
    var dashSeparator = "------------------------------";
    var header = folderName + "/" + doc.name;
    LOG_ARRAY.push(dashSeparator + "\n" + header + "\n" + dashSeparator);

    if (missingLinks.length) {
      addSection("missing", missingLinks);
    }
    if(squishedImages.length) {
      addSection("squished", squishedImages);
    }
    if(lowResImages.length) {
      addSection("low res", lowResImages);
    }
    LOG_ARRAY.push("");
  }
 
  doc.close();
  logCount();
}

function checkLinks(docToCheck) {
  var allLinks = docToCheck.links;
  var missingLinks = [];

  for (var linksIndex = 0; linksIndex < allLinks.length; linksIndex++) {
    if (allLinks[linksIndex].status === LinkStatus.LINK_MISSING) {
      missingLinks.push(allLinks[linksIndex].name);
    }
  }
  return missingLinks;
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

function checkSquish(image) {
  var xPPI = image.effectivePpi[0];
  var yPPI = image.effectivePpi[1];
  if (xPPI !== yPPI) return image.itemLink.name.split(".")[0];
}

function checkRes(image) {
  var xPPI = image.effectivePpi[0];
  var yPPI = image.effectivePpi[1];

  if (xPPI < THRESHOLD || yPPI < THRESHOLD) {
    var scaleBy = Math.ceil(THRESHOLD / xPPI * 100);
    return image.itemLink.name.split(".")[0] + " - upres by " + scaleBy + "%";
  }
}

function addSection(name, contents) {
  var indent = "    ";
  var indentedContents = [];

  for (var contentsIndex = 0; contentsIndex < contents.length; contentsIndex++) {
    indentedContents.push(indent + contents[contentsIndex]);
  }

  LOG_ARRAY.push(name + ":");
  LOG_ARRAY = LOG_ARRAY.concat(indentedContents);
  LOG_ARRAY.push("");
}

function logCount() {
  COUNT--;
  pbar.value += 1;
}

function writeLogFile(logTitle, itemsToLog) {
  var logFile = new File("~/Desktop/" + logTitle + ".txt");
  logFile.encoding = "UTF-8";
  logFile.open("w");
  logFile.write(itemsToLog.join("\n"));
  logFile.close();
}


main();

