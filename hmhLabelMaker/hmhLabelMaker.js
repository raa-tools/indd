﻿#target InDesign

// Do some checking before we run anything
try {
  var DOC = app.activeDocument

  if(DOC.name !== "HOL_Label_Starter.indd") {
    alert("Current file is not a starter file!\nUse HOL_Label_Starter.indd to start")
    exit()
  }
} catch(e) {
  alert("Open the starter file!\nUse HOL_Label_Starter.indd to start")
  exit()
}

// GLOBALS
var uiWindow
var LEFTMARGIN = 0.5 // in inches
var PPI = 72 // for co-ordinate space
app.scriptPreferences.measurementUnit = MeasurementUnits.inches;

// Defaults
var LABEL = {
  cols: 1,
  colWidth: 7,
  totalWidth: calculateWidth(1, 7),
  height: 9,
}

// UI STUFF
function uiSetup() {
  uiWindow = new Window("dialog", "HMH LabelMaker");
  
  // Row 1
  var row1 = uiWindow.add("group {alignment: 'left'}")
  // Column input
  var colStatic = row1.add('statictext {text: "Columns:", size: [65, 24], alignment: "bottom", justify: "left"}');
  var colEditText = row1.add('edittext {text: "1", size: [40, 25], active: true}');
  
  // Row 2
  var row2 = uiWindow.add("group {alignment: 'left'}")
  // Width
  var widthStatic = row2.add('statictext {text: "Width (in.):", size: [65, 24], alignment: "bottom", justify: "left"}');
  var widthEditText = row2.add('edittext {text: "' + calculateWidth(colEditText.text, LABEL.colWidth) + '", size: [80, 25], active: false, enabled: false}');
  var widthEditableCheck = row2.add("checkbox {size: [65, 15], text: 'Edit'}")
  
  // Row 3
  var row3 = uiWindow.add("group {alignment: 'left'}")
  // Height
  var heightStatic = row3.add('statictext {text: "Height (in.):", size: [65, 24], alignment: "bottom", justify: "left"}');
  var heightEditText = row3.add('edittext {text: "' + LABEL.height + '", size: [80, 25], active: false, enabled: false}');
  var heightEditableCheck = row3.add("checkbox {size: [65, 15], text: 'Edit'}")

  // Buttons
  var buttonGroup = uiWindow.add("group {alignment: 'center'}");
  buttonGroup.add ("button", undefined, "OK");
  buttonGroup.add ("button", undefined, "Cancel");

  // UI event listeners
  colEditText.onChanging = function() {
    LABEL.cols = parseInt(colEditText.text) // Update global object property
    if(widthEditableCheck.value) return // Don't calculate width if editing width manually
    LABEL.totalWidth = calculateWidth(colEditText.text, LABEL.colWidth)
    widthEditText.text = LABEL.totalWidth
  }

  widthEditText.onChanging = function() {
    LABEL.totalWidth = parseFloat(widthEditText.text) // Update global object property
  }

  heightEditText.onChanging = function() {
    LABEL.height = parseFloat(heightEditText.text) // Update global object property
  }

  widthEditableCheck.onClick = function() {
    if(widthEditableCheck.value) {
      widthEditText.enabled = true;
    } else {
      widthEditText.text = calculateWidth(colEditText.text, LABEL.colWidth)
      widthEditText.enabled = false;
    }
  }

  heightEditableCheck.onClick = function() {
    if(heightEditableCheck.value) {
      heightEditText.enabled = true;
    } else {
      heightEditText.text = "9"
      heightEditText.enabled = false
    }
  }
}
// END UI STUFF

// HELPERS
function calculateWidth(numOfCols, colWidth, margin) {
  var marginToUse = margin || LEFTMARGIN
  return parseFloat(numOfCols * colWidth + marginToUse)
}

function updateSlug(varText, width, height) {
  // Check if variable text item exists and is the right type
  // If not, add one
  if(!varText.isValid || varText.variableType !== VariableTypes.CUSTOM_TEXT_TYPE) {
      varText = doc.textVariables.add();
      varText.variableType = VariableTypes.CUSTOM_TEXT_TYPE;
      varText.name = "Dimensions";
  }
  
  // Either way, insert content here
  varText.variableOptions.contents =
    Math.round(1000*width)/1000 +
    " × " +
    Math.round(1000*height)/1000 +
    " in.";
}

function findFrameWithLabel(allFrames, labelToMatch) {
  // Finds the first instance of frame.label === labelToMatch
  for(var i = 0; i < allFrames.length; i ++) {
    // Exclude Code and info bc that's always not part of anything
    if(allFrames[i].itemLayer.name !== "Code and info" && allFrames[i].label === labelToMatch) {
      return allFrames[i]
    } 
  }
}

function getNumberOfCurrentCols(textFrame) {
  return textFrame.textColumns.length
}

function duplicateContent(contentFrame) {
  var contentCopy = contentFrame.contents
  for(var col = getNumberOfCurrentCols(contentFrame); col < LABEL.cols; col++) {
    contentFrame.parentStory.insertionPoints.item(-1).contents = SpecialCharacters.COLUMN_BREAK
    contentFrame.parentStory.insertionPoints.item(-1).contents = contentCopy
  }
}
// END HELPERS

// MAIN FUNCTIONS
function resizePage() {
  // resize page first, so we have control over anchor location
  // (where it's resized from)
  var currentPage = app.activeWindow.activePage;

  currentPage.resize(
    CoordinateSpaces.INNER_COORDINATES,
    AnchorPoint.TOP_LEFT_ANCHOR,
    ResizeMethods.REPLACING_CURRENT_DIMENSIONS_WITH,
    [LABEL.totalWidth * PPI,LABEL.height * PPI]
  )
}

function resizeDocument(docToResize) {
  // resize document after page has been resized,
  // so the dims can be used for Dimensions slug
  docToResize.documentPreferences.pageWidth = LABEL.totalWidth;
  docToResize.documentPreferences.pageHeight = LABEL.height;

  var varText = docToResize.textVariables.item("Dimensions");
  updateSlug(varText, LABEL.totalWidth, LABEL.height)
}

function duplicateTextFrame(containingDoc) {
  var textboxes = containingDoc.textFrames
  var frameToDupe = findFrameWithLabel(textboxes, "labelColumn")
  // Start x at 1 because there's already 1 col on the page
  for(var i = 1; i < LABEL.cols; i++) {
    var xLocation = LABEL.colWidth * i
    frameToDupe.duplicate(undefined, [xLocation, 0])
  }
}

function extendTextFrame(containingDoc) {
  var textboxes = containingDoc.textFrames
  var frameToDupe = findFrameWithLabel(textboxes, "labelColumn")

  frameToDupe.textFramePreferences.textColumnCount = LABEL.cols
  duplicateContent(frameToDupe)
}



function resizeBackground(containingDoc) {
  var rects = containingDoc.rectangles
  var rectToResize

  for(var i = 0; i < rects.length; i++) {
    if(rects[i].itemLayer.name === "BACKGROUND - DO NOT PRINT") {
      rectToSize = rects[i]
    }
  }

  rectToSize.resize(
    CoordinateSpaces.INNER_COORDINATES,
    AnchorPoint.TOP_LEFT_ANCHOR,
    ResizeMethods.REPLACING_CURRENT_DIMENSIONS_WITH,
    [LABEL.totalWidth * PPI,LABEL.height * PPI]
  )
}
// END MAIN FUNCTIONS


// RUN THIS THING
uiSetup()
if(uiWindow.show() == true) {
    resizePage()
    resizeDocument(DOC)
    extendTextFrame(DOC)
    resizeBackground(DOC)
} else {
    exit();
}