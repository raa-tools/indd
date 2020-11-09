// Match document page size and margin to
// the current page's size and margins
// (ie. if page size was set with page tool)

#target InDesign
app.scriptPreferences.measurementUnit = MeasurementUnits.points;

if (app.documents.length > 0) {
  getAndUpdateDims(app.activeDocument)
} else {
  var panelFolder = Folder.selectDialog("Pick panels");
  var panelFiles = panelFolder.getFiles("*.indd");

  for (var i = 0; i < panelFiles.length; i++) {
    var doc = app.open(panelFiles[i])
    getAndUpdateDims(doc)
    doc.save()
    doc.close()
  }
}

function getAndUpdateDims(doc) {
  var activePage = doc.layoutWindows[0].activePage

  var pageDims = getPageDims(activePage)
  var pageMargins = getPageMargins(activePage)

  updateDocSizes(doc, pageDims)
  updateDocMargins(doc, pageMargins)
}

function getPageDims(page) {
  var pageWidth = page.bounds[3] - page.bounds[1]
  var pageHeight = page.bounds[2] - page.bounds[0]

  return { width: pageWidth, height: pageHeight }
}

function getPageMargins(page) {
  var top = page.marginPreferences.top
  var right = page.marginPreferences.right
  var bottom = page.marginPreferences.bottom
  var left = page.marginPreferences.left
  
  return { top: top, right: right, bottom: bottom, left: left }
}

function updateDocSizes(doc, newSizes) {
  if (newSizes.width && doc.documentPreferences.pageWidth !== newSizes.width) {
    doc.documentPreferences.pageWidth = newSizes.width
  }

  if (newSizes.height && doc.documentPreferences.pageHeight !== newSizes.height) {
    doc.documentPreferences.pageHeight = newSizes.height
  }
}

function updateDocMargins(doc, newMargins) {
  if (newMargins.top && doc.marginPreferences.top !== newMargins.top) {
    doc.marginPreferences.top = newMargins.top
  }

  if (newMargins.right && doc.marginPreferences.right !== newMargins.right) {
    doc.marginPreferences.right = newMargins.right
  }

  if (newMargins.bottom && doc.marginPreferences.bottom !== newMargins.bottom) {
    doc.marginPreferences.bottom = newMargins.bottom
  }

  if (newMargins.left && doc.marginPreferences.left !== newMargins.left) {
    doc.marginPreferences.left = newMargins.left
  }
}

