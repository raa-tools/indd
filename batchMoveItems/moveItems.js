#target "InDesign"
app.scriptPreferences.measurementUnit = MeasurementUnits.points;

// Deltas in PT
var deltaX = 0
var deltaY = -13

var layerName = "Type"

var transformMatrix = app.transformationMatrices.add({
  horizontalTranslation: deltaX,
  verticalTranslation: deltaY
})

var panelFolder = Folder.selectDialog("Pick panel folder");
var panelFiles = panelFolder.getFiles("*.indd");

for (var i = 0; i < panelFiles.length; i++) {
  var doc = app.open(panelFiles[i], false)

  // Silently fail when layer isn't found
  var layer = doc.layers.item(layerName)
  if (!layer) {
    break
  }

  var items = layer.pageItems

  // bounds are [y1, x1, y2, x2]
  for (var j = 0; j < items.length; j++) {
    items[j].transform(
      CoordinateSpaces.INNER_COORDINATES,
      AnchorPoint.CENTER_ANCHOR,
      transformMatrix
    )
  }

  doc.save()
  doc.close()
}
