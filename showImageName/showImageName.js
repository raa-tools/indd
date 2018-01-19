#target "InDesign-8.0"

app.scriptPreferences.measurementUnit = MeasurementUnits.points;

var doc = app.activeDocument;
var pages = doc.pages;

var gNumLayer; var gNumFrame;
var imageLayer = doc.layers.item("IMAGES");
var varImgName = doc.textVariables.item("Image Name");

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
            var imgY = pageItems[i].geometricBounds[0];
            var imgX = pageItems[i].geometricBounds[1];
            
            addGNumFrame(imgY, imgX);
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
    gNumLayer.move(LocationOptions.AFTER, doc.layers[1]);
}

// Make text frames for gNum labels
function addGNumFrame(yLoc, xLoc) {
    gNumFrame = pages[j].textFrames.add({itemLayer: gNumLayer, geometricBounds: [yLoc, xLoc, yLoc + 38, xLoc + 512]});
    gNumFrame.textVariableInstances.add({associatedTextVariable: varImgName});
    gNumFrame.parentStory.appliedParagraphStyle = "New Code Bold";
    gNumFrame.parentStory.appliedCharacterStyle = doc.characterStyles.item("[None]");
    gNumFrame.parentStory.clearOverrides();
}