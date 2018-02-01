#target "InDesign-8.0"

app.scriptPreferences.measurementUnit = MeasurementUnits.points;

var doc = app.activeDocument;
var pages = doc.pages;

var gNumLayer; var gNumFrame;
var imageLayer = doc.layers.item("IMAGES");
var varImgName = doc.textVariables.item("Image Name");

var gNumFrameOffset = 24;

// This needs to be fixed:
// if(!varImgName.isValid) {
//     // var imgNameMetadata = CaptionMetadataVariablePreference
//     varImgName = doc.textVariables.add();
//     varImgName.variableType = VariableTypes.LIVE_CAPTION_TYPE;
//     // varImgName.variableOptions = 
//     varImgName.name = "Image Name";
// }

refreshGNumLayer()

for(var j = 0; j < pages.length; j++) {
    var pageItems = pages[j].allPageItems;
    
    for(var i = 0; i < pageItems.length; i++) {    
        if(pageItems[i].itemLayer === imageLayer && (pageItems[i] instanceof Rectangle || pageItems[i] instanceof Oval) && pageItems[i].images.length == 1) {
            var imgX = pageItems[i].geometricBounds[1];
            var imgY = pageItems[i].geometricBounds[0];
            var imgWidth = pageItems[i].geometricBounds[3] - imgX;
            
            // Some catches so labels don't appear outside of the artboard
            if(imgX < 0) {
                imgX = 0;
            }

            if(imgY < 0){
                imgY = 0;
            }

            // Set width of text frame
            if(imgWidth < 1836) {
                var textWidth = imgWidth - gNumFrameOffset * 2;
            
            } else {
                var textWidth = imgWidth / 2 - gNumFrameOffset * 2;
            }

            addGNumFrame(imgX + gNumFrameOffset, imgY + gNumFrameOffset, textWidth);
        }
    }
}


/* ---------------- */
/* HELPER FUNCTIONS */
/* ---------------- */

// Delete & remake layer for gNum labels
function refreshGNumLayer() {
    gNumLayer = doc.layers.item("G NUMBERS - DO NOT PRINT");

    if(gNumLayer.isValid) {
        gNumLayer.remove();
    }

    gNumLayer = doc.layers.add({name: "G NUMBERS - DO NOT PRINT"});
    gNumLayer.move(LocationOptions.AFTER, doc.layers[0]);
}

// Make text frames for gNum labels
function addGNumFrame(xLoc, yLoc, width) {
    gNumFrame = pages[j].textFrames.add({itemLayer: gNumLayer, geometricBounds: [yLoc, xLoc, yLoc + 100, xLoc + width]});
    gNumFrame.textVariableInstances.add({associatedTextVariable: varImgName});
    gNumFrame.appliedObjectStyle = doc.objectStyles.item("[None]");

    with(gNumFrame.parentStory) {
        appliedParagraphStyle = "New Code Bold";
        appliedCharacterStyle = doc.characterStyles.item("[None]");
        clearOverrides();
    
        // An incomplete catch for big TL panels
        // Otherwise the labels aren't legible in transmittal doc
        if(doc.name.split("_")[0] === "TL") {
            pointSize = 78;
            ruleAboveLineWeight = 42;
        }
    }
}