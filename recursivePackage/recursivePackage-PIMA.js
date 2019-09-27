// Recursively go through directories and package files
// Should prob add a progress bar...
#target InDesign

// Grab interaction pref to reset to later
var oldInteractionPref = app.scriptPreferences.userInteractionLevel;

// Don't see any popups
app.scriptPreferences.userInteractionLevel=UserInteractionLevels.NEVER_INTERACT;

var COUNT = 0;
var SOURCE_FOLDER = Folder.selectDialog("Pick source folder");
var TARGET_FOLDER = Folder.selectDialog("Pick target folder");

// For progress bar: go through folders and count number of panels
recurseTraverse(SOURCE_FOLDER, countFiles);

// Then use count to build progress bar
var w = new Window("palette");
pbar = w.add("progressbar", undefined, 0, COUNT);
pbar.preferredSize.width = 300;
w.show();

// Then actually do the work...
recurseTraverse(SOURCE_FOLDER, packageFile);
app.scriptPreferences.userInteractionLevel = oldInteractionPref; // reset to old pref

// Primary recursive function. Takes in root directory and a callback (action)
// This is a depth-first recursive function
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

// Main packaging function
function packageFile(file) {
  // A little convoluted, but essentially used to grab relative paths
  // so we can copy folder structure in target folder
  var destPath = TARGET_FOLDER + file.absoluteURI
    .replace(SOURCE_FOLDER.absoluteURI, "")
    .replace(".indd", "");

  var destFolder = new Folder(destPath);
  if (!destFolder.exists) {
    destFolder.create();
  }

  var docToPackage = app.open(file, false);

  // For more info on args: http://jongware.mit.edu/idcs6js/pc_Document.html#packageForPrint
  docToPackage.packageForPrint(destFolder, true, true, false, true, true, true, false);
  docToPackage.close();
  logCount();
}

// Quick log for now
function logCount() {
  COUNT--;
  pbar.value += 1;
}

// Increment COUNT for progress bar
function countFiles(file) {
  COUNT++;
}

// Print funciton for convenience...
function printFileName(file) {
  $.writeln(file.name);
}

