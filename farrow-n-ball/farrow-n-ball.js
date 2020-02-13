#target "InDesign-8.0"

COLOUR_LAYER_NAME = "KELURE"
PAGE_STEP = 2

var doc = app.activeDocument
var colLayer = doc.layers.item(COLOUR_LAYER_NAME)
try {
  colLayer.name
} catch (e) {
  doc.layers.add({name: COLOUR_LAYER_NAME})

  alert("Place shapes in the '" + COLOUR_LAYER_NAME + "' layer.")
  exit()
}

var pageDialog, startText, endText, stepText
setupDialog()

if (pageDialog.show() == 1) {
  main(startText.text, endText.text, PAGE_STEP)
} else {
  exit()
}

function setupDialog() {
  pageDialog = new Window("dialog", "$110 a gallon");

  // Row 1
  var inputRow1 = pageDialog.add("group {alignment: 'left'}");
  
  // Input texts
  var startLabel = inputRow1.add('statictext {text: "Start:", size: [65, 24], alignment: "bottom", justify: "left"}');
  startText = inputRow1.add('edittext {text: "1", size: [40, 25], active: true}');
  
  var endLabel = inputRow1.add('statictext {text: "End:", size: [55, 24], alignment: "bottom", justify: "right"}');
  endText = inputRow1.add('edittext {text: "1", size: [40, 25]}');

  var buttonGroup = pageDialog.add("group {alignment: 'right'}");
  var okButton = buttonGroup.add ("button", undefined, "OK");
  var cancelButton = buttonGroup.add ("button", undefined, "Cancel");
}

function main(start, end, step) {
  var startPageNum = parseInt(start)
  var endPageNum = parseInt(end)
  var pageStep = parseInt(step)

  var pages = doc.pages
  var startColor = getGradientColor(pages, startPageNum)
  var endColor = getGradientColor(pages, endPageNum)
  var rectBounds = getBounds(pages, startPageNum)

  var endIdx = endPageNum - startPageNum

  for (var i = 1; i < endIdx - 1; i += pageStep) {
    // clear shapes in COLOUR layer for these pages
    var step = i / endIdx
    var colorValue = blendColors(startColor, endColor, step)
    var color = doc.colors.add()
    color.colorValue = colorValue

    var gradient = doc.gradients.add()
    gradient.gradientStops[0].stopColor = "Paper"
    gradient.gradientStops.add({location: 50, stopColor: color})
    gradient.gradientStops[2].stopColor = "Paper"

    pages[startPageNum + i].rectangles.add(colLayer, {geometricBounds: rectBounds, fillColor: gradient, strokeColor: "None" })
  }
}

function getBounds(docPages, startPage) {
    var rects = docPages[startPage - 1].rectangles
    
    if (!rects.length) {
      alert("No gradient on page " + startPage + ".")
      exit()
    }

    for (var i = 0; i < rects.length; i++) {
      var rect = rects[i]
      if (rect.itemLayer.name === COLOUR_LAYER_NAME) {
        var bounds = rect.geometricBounds

        if (startPage === 1) {
          var pageWidth = docPages[startPage].bounds[3]
          bounds[1] += pageWidth
          bounds[3] += pageWidth
        }

        return bounds
      }
    }
}

function getGradientColor(docPages, pageNum) {
  // pageNum is pageIdx + 1
  var rects = docPages[pageNum - 1].rectangles

  if (!rects.length) {
    alert("No gradient on page " + pageNum + ".")
    exit()
  }

  var firstGradientColor
  for (var i = 0; i < rects.length; i++) {
    var rect = rects[i]

    var gradientColor
    if (rect.itemLayer.name === COLOUR_LAYER_NAME) {
      gradientColor = rect.fillColor.gradientStops[1].stopColor.colorValue
    }

    if (i === 0) {
      firstGradientColor = gradientColor
    } else if (!checkColors(firstGradientColor, gradientColor)){
      alert("Multiple gradients on page " + pageNum + ".")
      exit()
    }
  }
  return firstGradientColor
}

function blendColors(color1, color2, step) {
  // colors are [c, m, y, k], step is number 0 - 1.0
  // returns color in [c, m, y, k]

  var blendedColor = []
  for (var i = 0; i < color1.length; i++) {
    var valToAdd = Math.round((color1[i] + ((color2[i] - color1[i]) * step)) * 100) / 100
    blendedColor.push(valToAdd)
  }
  return blendedColor
}

function checkColors(color1, color2) {
  // colors are [c, m, y, k]

  for (var i = 0; i < color1.length; i++) {
    if (color1[i] !== color2[i]) return false
  }
  return true
}
