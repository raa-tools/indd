// Recursively go through directories and package files
// Should prob add a progress bar...
#target InDesign

// Grab interaction pref to reset to later
var oldInteractionPref = app.scriptPreferences.userInteractionLevel;

// Don't see any popups
app.scriptPreferences.userInteractionLevel=UserInteractionLevels.NEVER_INTERACT;

var sourceFolder = Folder.selectDialog("Pick source folder");
var targetFolder = Folder.selectDialog("Pick target folder");

recursive_package(sourceFolder);
app.scriptPreferences.userInteractionLevel = oldInteractionPref; // reset to old pref

function recursive_package(directory) {
  var files = directory.getFiles("*");

  for (var i = 0; i < files.length; i++) {
    // If file is actually dir, then recurse
    if (typeof files[i].type == "undefined") {
      var folder = new Folder(files[i].relativeURI);
      recursive_package(folder);
    }

    // Only do stuff to indd files
    if (files[i].name.split(".").pop() === "indd") {
      // A little convoluted, but essentially used to copy folder structure in target folder
      var destPath = targetFolder + files[i].absoluteURI
        .replace(sourceFolder.absoluteURI, "")
        .replace(files[i].name, "");

      var file = new File(files[i]);
      package_file(file, destPath);
    }
  }
}

function package_file(file, destination) {
  var destFolder = new Folder(destination);
  if (!destFolder.exists) {
    destFolder.create();
  }

  var docToPackage = app.open(file, false);

  // For more info on args: http://jongware.mit.edu/idcs6js/pc_Document.html#packageForPrint
  docToPackage.packageForPrint(destFolder, true, true, false, true, true, true, false);
  docToPackage.close();
}

