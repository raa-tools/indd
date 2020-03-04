#target "InDesign"

app.scriptPreferences.measurementUnit = MeasurementUnits.points;
var doc = app.activeDocument
var currentPage = app.activeWindow.activePage
var internalPageWidth = currentPage.bounds[3] - currentPage.bounds[1] - currentPage.marginPreferences.right;

// pick images from folder
var imageFiles = File.openDialog("Select images to place", null, true)

var x = currentPage.marginPreferences.left
var y = currentPage.marginPreferences.top
for (var i = 0; i < imageFiles.length; i++) {
  if (x >= internalPageWidth) {
    x = 0
    y += 82
  }

  var imageFile = imageFiles[i]
  var rect = doc.rectangles.add({
    geometricBounds: [y, x, y + 72, x + 72],
    fillColor: "None",
    strokeColor: "None",
    frameFittingOptions: {
      fittingOnEmptyFrame: EmptyFrameFittingOptions.FILL_PROPORTIONALLY
    }
  })

  rect.place(imageFile)
  rect.fit(FitOptions.FRAME_TO_CONTENT)

  var rectWidth = rect.geometricBounds[3] - rect.geometricBounds[1]
  x += rectWidth + 10
}
