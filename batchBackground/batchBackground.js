#target InDesign

var panelFolder = Folder.selectDialog("Pick panel folder");
var panelFiles = panelFolder.getFiles("*.indd");

var w = new Window("palette");
w.progressBar = w.add ('progressbar', undefined, 0, panelFiles.length);
w.progressBar.preferredSize.width = 300;
w.show();

for (var i = 0; i < panelFiles.length; i++) {
  var doc = app.open(panelFiles[i], false);
  var page = doc.pages[0]

  w.progressBar.value += 1

  doc.layers.itemByName("Background").remove()
  doc.layers.add({name: "Background"})

  var bgLayer = doc.layers.itemByName("Background")
  bgLayer.move(LocationOptions.AT_END)

  var bleed = doc.documentPreferences.documentBleedTopOffset

  // [y1, x1, y2, x2]
  var pageBounds = []
  for (var j = 0; j < page.bounds.length; j++) {
    var pageBound = page.bounds[j]
    var newBound = j < 2 ? pageBound - bleed : pageBound + bleed
    pageBounds.push(newBound)
  }

  var bounds = []
  doc.rectangles.add({
    fillColor: "Black",
    strokeColor: "None",
    itemLayer: bgLayer,
    geometricBounds: pageBounds
  })

  doc.save()
  doc.close()
}
