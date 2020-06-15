#target InDesign

var panelFolder = Folder.selectDialog("Pick panel folder");
var panelFiles = panelFolder.getFiles("*.indd");

var NEW_WIDTH_FULL = 44.1875
var NEW_WIDTH_HALF = 21.75
var NEW_HEIGHT = 3.93
var DPI = 72

var badPanels = []

// Progress bar
var w = new Window("palette");
w.progressBar = w.add ('progressbar', undefined, 0, panelFiles.length);
w.progressBar.preferredSize.width = 300;
w.show();

app.scriptPreferences.measurementUnit = MeasurementUnits.points;
for(var j = 0; j < panelFiles.length; j++) {
    var doc = app.open(panelFiles[j], false);
    w.progressBar.value = j+1;

    var page = doc.pages[0];

    var width = page.bounds[3] - page.bounds[1]
    var height = page.bounds[2] - page.bounds[0]

    var newWidth;
    if (width === 48 * DPI) {
      newWidth = NEW_WIDTH_FULL * DPI
      $.writeln("LONG", newWidth)
    } else if (width === 24 * DPI) {
      newWidth = NEW_WIDTH_HALF * DPI
    }

    var newHeight = NEW_HEIGHT * 72;
    
    if (newWidth && newHeight) {
      page.resize(CoordinateSpaces.INNER_COORDINATES, AnchorPoint.CENTER_ANCHOR, ResizeMethods.REPLACING_CURRENT_DIMENSIONS_WITH, [newWidth, newHeight])
      doc.save();
    } else {
      badPanels.push(doc.name)
    }

    doc.close();
}

$.writeln(badPanels.join("\n"))
