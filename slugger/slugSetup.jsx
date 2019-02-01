/*
Set up slug information for panel files.

Currently, this script will add the following panel attributes:
    * Panel code -- (File name)
    * Dimensions -- (W x H)
    * Review ------ (Batch # - Review #)
    * Date -------- (Defaults to today's date)

Would be great to let user add or remove attributes from a set list.
Some extras might be:
    * Graphic Technique
    * Type of panel
    * Gallery / Area
*/

//Just in case this little script gets lost in the woods:
#target InDesign

// GLOBAL VARIABLES – CHANGE PER PROJECT AS NECESSARY
BLEEDDIM = 36;
SLUGDIM = 144;

// Set some breakpoints (in in.) to determine how
// the slug "reflows" textboxes
BREAKPOINT = {
    1 : 612, // 8.5 in.
    2 : 324 // 4.5 in., about the width of 1 row of info
};

FONT = {
    FAMILY  : "Helvetica",
    WEIGHT1 : "Light",
    WEIGHT2 : "Bold",
    SIZE1   : 22,
    SIZE2   : 14,
    LEADING : 24,
};

try{
    // These are declared here so they can be used by dialogSetup()
    var myWindow, batchEditText, reviewEditText, dateEditText;
    var sampleCheck, fabCheck; 
    var notesCheck, notesEditText;
    var alreadyRun;
    
    // If there are files open, set up slug for active document
    if(app.documents.length !== 0) {
        var singleDoc = app.activeDocument;
        dialogSetup();

        if(myWindow.show()) {
            main(singleDoc);
        } else {
            app.dialogs.everyItem().destroy();
        }

    // Else pick a folder of files
    } else {
        var panelFolder = Folder.selectDialog("Pick panels");
        var panelFiles = panelFolder.getFiles("*.indd");

        dialogSetup();

        if(myWindow.show()) {
            for(var i = 0; i < panelFiles.length; i++) {
                var panelFile = app.open(panelFiles[i]);

                main(panelFile);
                panelFile.save();
                panelFile.close();
            }

            // Add some error logging here at some point...

        } else {
            app.dialogs.everyItem().destroy();
        }
    }

} catch(error) {
    alert(error);
}

function dialogSetup() {
    var today = getTodaysDate();

    myWindow = new Window("dialog", "Panels are CHILL");

    // Row 1
    var inputRow1 = myWindow.add("group {alignment: 'left'}");
    
    // Batch
    var batchStaticText = inputRow1.add('statictext {text: "Batch:", size: [65, 24], alignment: "bottom", justify: "left"}');
    batchEditText = inputRow1.add('edittext {text: "1", size: [40, 25], active: true}');
    
    var reviewStaticText = inputRow1.add('statictext {text: "Review:", size: [55, 24], alignment: "bottom", justify: "right"}');
    reviewEditText = inputRow1.add('edittext {text: "1", size: [40, 25]}');

    // Row 1.5
    var inputRow1_5 = myWindow.add("group {alignment: 'left'}");

    // SAMPLE
    sampleCheck = inputRow1_5.add("checkbox {size: [80, 15], text: '\u00A0SAMPLE'}");
    sampleCheck.onClick = function() {
        if(sampleCheck.value) {
            batchEditText.enabled = false;
            batchEditText.text = "";
            fabCheck.enabled = false;
        
        } else {
            fabCheck.enabled = true;
            batchEditText.enabled = true;
            batchEditText.text = "1";
        }
    }

    // Row 2
    var inputRow2 = myWindow.add("group {alignment: 'left'}");

    // TO FABRICATOR
    fabCheck = inputRow2.add("checkbox {size: [65, 15], text: '\u00A0FAB:'}");
    fabCheck.onClick = function() {
        if(fabCheck.value) {
            sampleCheck.enabled = false;
            fabEditText.enabled = true;
            reviewEditText.enabled = false;
            reviewEditText.text = "";
        
        } else {
            sampleCheck.enabled = true;
            fabEditText.enabled = false;
            fabEditText.text = "";
            reviewEditText.enabled = true;
            reviewEditText.text = "1";
        }
    }

    fabEditText = inputRow2.add("edittext {size: [155, 25]}");
    fabEditText.enabled = false;

    // Row 3
    var inputRow3 = myWindow.add('group {alignment: "left"}');

    // Date
    var dateStaticText = inputRow3.add("statictext {text: 'Date:', size: [65, 24], alignment: 'bottom', justify: 'left'}");
    dateEditText = inputRow3.add("edittext {size: [155, 25]}");
    dateEditText.text = today;


    // Row 4
    var inputRow4 = myWindow.add("group {alignment: 'left'}");

    // Notes
    notesCheck = inputRow4.add("checkbox {size: [65, 15], text: '\u00A0Notes:'}");
    notesCheck.onClick = function() {
        if(notesCheck.value) {
            notesEditText.enabled = true;
        
        } else {
            notesEditText.enabled = false;
            notesEditText.text = "";
        }
    }

    notesEditText = inputRow4.add("edittext", [0, 0, 155, 100], "", {multiline: true, scrolling: true, wantReturn: true});
    notesEditText.enabled = false;

    // Buttons
    var buttonGroup = myWindow.add("group {alignment: 'right'}");
    buttonGroup.add ("button", undefined, "OK");
    buttonGroup.add ("button", undefined, "Cancel");


    function getTodaysDate() {
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];    
        var timeStamp = new Date();
    
        return monthNames[timeStamp.getMonth()] + " " + timeStamp.getDate() + ", " + timeStamp.getFullYear();
    }
}

// Using a main() function so the entire try block above isn't super long...
function main(docToSetup) {    
    ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
    ////// ////// /////      —    Document  Business     —      ///// ////// //////
    ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
    
    // Doc setup
    var myPage = app.activeWindow.activePage;

    // Grab dims in inches real quick...
    app.scriptPreferences.measurementUnit = MeasurementUnits.inches;
    var pageWidth = Math.round(1000*docToSetup.documentPreferences.pageWidth)/1000; 
    var pageHeight = Math.round(1000*docToSetup.documentPreferences.pageHeight)/1000;
    var pageDims =  pageWidth + " × " + pageHeight + " in.";
    
    // Grab dims one more time, in pts
    app.scriptPreferences.measurementUnit = MeasurementUnits.points;
    pageWidth = docToSetup.documentPreferences.pageWidth;
    pageHeight = docToSetup.documentPreferences.pageHeight;

    //Reset the Zero Point/Ruler to top left corner
    docToSetup.zeroPoint = [0,0];

    var bottomSlug = (notesCheck.value && pageWidth <= BREAKPOINT.2) ? SLUGDIM * 1.75 : SLUGDIM;

    docToSetup.documentPreferences.properties = {
      documentSlugUniformSize : false
    };

    //Set bleed and slug dims
    docToSetup.documentPreferences.properties = {
        documentBleedBottomOffset         : BLEEDDIM ,
        documentBleedTopOffset            : BLEEDDIM ,
        documentBleedInsideOrLeftOffset   : BLEEDDIM ,
        documentBleedOutsideOrRightOffset : BLEEDDIM,
        slugBottomOffset                  : bottomSlug,
        slugTopOffset                     : SLUGDIM,
        slugInsideOrLeftOffset            : SLUGDIM,
        slugRightOrOutsideOffset          : SLUGDIM
    };

    // Add text variables for File Name & Dimensions
    var varFileName = docToSetup.textVariables.item("File Name");
    var varDims = docToSetup.textVariables.item("Dimensions");

/////// maybe check if dims in page tool === dims in page setup
/// if not, use page tools' dims?

    // Check if variable text item exists and is the right type
    // If not, add one
    if(!varDims.isValid || varDims.variableType !== VariableTypes.CUSTOM_TEXT_TYPE) {
        varDims = docToSetup.textVariables.add();
        varDims.variableType = VariableTypes.CUSTOM_TEXT_TYPE;
        varDims.name = "Dimensions";
    }
    
    // Either way, insert content here
    varDims.variableOptions.contents = pageDims;


    ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
    ////// //////   —   Code and info layer set up    —   ////// //////
    ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
    
    var codeInfoLayer = docToSetup.layers.item("Code and info");

    if(codeInfoLayer.isValid) {
        codeInfoLayer.remove();
    }

    codeInfoLayer = docToSetup.layers.add({name: "Code and info"});
    codeInfoLayer.move(LocationOptions.BEFORE, docToSetup.layers[0]);    


    ////// ////// ////// ////// //////  ////// ////// ////// ////// ////// ////// 
    //   —   Establish Paragraph and Character Styles needed for Slug   —    //
    ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 

    // Object style
    // If "SLUG TEXTBOXES" style doesn't exist, make one
    if(!docToSetup.objectStyles.itemByName("SLUG TEXTBOXES").isValid) {
        var slugObjectStyle = docToSetup.objectStyles.add();
        slugObjectStyle.properties =  {
            name: "SLUG TEXTBOXES",
            enableFill: false,
            enableStroke: false,
            enableTextFrameBaselineOptions: true,
            textFramePreferences: {
                firstBaselineOffset : FirstBaseline.LEADING_OFFSET
            }
        }
    }

    var my_CODE_NOTE_characterStyle = docToSetup.characterStyles.item("New Code Note");

    if(my_CODE_NOTE_characterStyle.isValid) {
        my_CODE_NOTE_characterStyle.remove();
    }

    my_CODE_NOTE_characterStyle = docToSetup.characterStyles.add({name:"New Code Note"});

    with(my_CODE_NOTE_characterStyle){
        //Formatting the Character text style
        basedOn = "None";
        appliedFont = app.fonts.itemByName(FONT.FAMILY);
        fontStyle = FONT.WEIGHT1;
        pointSize = FONT.SIZE2;
        leading = FONT.LEADING;
        tracking = 25;
        capitalization = Capitalization.allCaps;
        fillTint = 50;
    }

    //Set up "New Code Light" Character Style
    var my_CODE_LIGHT_characterStyle = docToSetup.characterStyles.item("New Code Light");

    if(my_CODE_LIGHT_characterStyle.isValid) {
        my_CODE_LIGHT_characterStyle.remove();
    }

    my_CODE_LIGHT_characterStyle = docToSetup.characterStyles.add({name:"New Code Light"});

    with(my_CODE_LIGHT_characterStyle){
        //Formatting the Character text style
        basedOn = "None";
        appliedFont = app.fonts.itemByName(FONT.FAMILY);
        fontStyle = FONT.WEIGHT1;
        pointSize = FONT.SIZE1;
        leading = FONT.LEADING;
        tracking = 0;
        capitalization = Capitalization.normal;
        fillTint = 100;
    }


    //Set up "New Code Bold" Paragraph Style
    var my_CODE_BOLD_paragraphStyle = docToSetup.paragraphStyles.item("New Code Bold");

    if(my_CODE_BOLD_paragraphStyle.isValid) {
        my_CODE_BOLD_paragraphStyle.remove();
    }
    
    my_CODE_BOLD_paragraphStyle = docToSetup.paragraphStyles.add({name:"New Code Bold"});
    
    //Set up New "Yellow Highlight" Swatch Color
    var myColor = docToSetup.colors.item("Yellow Highlight")

    if(!myColor.isValid) {
        myColor = docToSetup.colors.add({name:"Yellow Highlight", model:ColorModel.process, colorValue:[0,0,100,0]});

    }
    
    with(my_CODE_BOLD_paragraphStyle){
        //Formatting the paragraph text style
        nextParagraphStyle = "None";
        appliedFont = app.fonts.itemByName(FONT.FAMILY);
        fontStyle = FONT.WEIGHT2;
        pointSize = FONT.SIZE1;
        leading = FONT.LEADING;
        fillColor = docToSetup.colors.item("Black");
        capitalization = Capitalization.allCaps;

        //Paragraph Rule Settings
        ruleAbove = true;
        ruleAboveLineWeight = FONT.SIZE1 + " pt";

        ruleAboveColor = docToSetup.colors.item("Yellow Highlight");
        ruleAboveOverprint = false;
        ruleAboveGapColor = docToSetup.swatches.item("None");
        ruleAboveGapOverprint = false;
        ruleAboveWidth = RuleWidth.textWidth;
        ruleAboveLeftIndent = 0;

        ruleAboveType = docToSetup.strokeStyles.item("Solid");
        ruleAboveTint = 100;
        ruleAboveGapTint = 100;
        ruleAboveOffset = -3;
        ruleAboveRightIndent = 0;
    }


    ////// ////// ////// ////// //////  ////// ////// ////// ////// ////// ////// 
    ////// //////   —   Set Up Text Boxes   —    ////// //////
    ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 

    var titleBoxData = {
        width  : 60, 
        height : FONT.LEADING,

        0 : "Code",
        1 : "w × h",
        2 : "Review",
        3 : "Date",
        4 : "Notes",
    };

    var inputBoxData = {
        width1 : 200,
        width2 : 260,
        width3 : 550,
        height : FONT.LEADING,

        0 : "codeInput",
        1 : "dimsInput",
        2 : "batchReviewInput",
        3 : "dateInput",
        4 : "notesInput",
    };

    ////// ////// ////// ////// //////  ////// ////// ////// ////// ////// ////// 
    ////// ////// ////// //// —  Apply all the things  —  //// ////// ////// ////
    ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 

    var codeInfoFrames = codeInfoLayer.textFrames;

    for(var z = 0; z < codeInfoFrames.length; z++) {
        codeInfoFrames[z].textFramePreferences.verticalJustification = VerticalJustification.TOP_ALIGN;

        if(codeInfoFrames[z].label === "codeInput") {
            var frameStory = codeInfoFrames[z].parentStory;

            frameStory.appliedCharacterStyle = docToSetup.characterStyles.item("[None]");
            frameStory.appliedParagraphStyle = my_CODE_BOLD_paragraphStyle;
            frameStory.justification = Justification.LEFT_ALIGN;
        
        } else if(codeInfoFrames[z].label.indexOf("Input") !== -1 && codeInfoFrames[z].label.indexOf("code") === -1) {
            var frameStory = codeInfoFrames[z].parentStory;

            frameStory.appliedCharacterStyle = my_CODE_LIGHT_characterStyle;
            frameStory.appliedParagraphStyle = docToSetup.paragraphStyles.item("[Basic Paragraph]");
            frameStory.justification = Justification.LEFT_ALIGN;
        
        } else {
            var frameStory = codeInfoFrames[z].parentStory;

            frameStory.appliedCharacterStyle = my_CODE_NOTE_characterStyle;
            frameStory.appliedParagraphStyle = docToSetup.paragraphStyles.item("[Basic Paragraph]");
            frameStory.justification = Justification.RIGHT_ALIGN;
        }
    }

    
    ////// ////// ////// ////// ////// /////// ////// ////// ////// ////// ////// 
    ////// ////// ////// ////   —  THE END IS NIGH  —   //// ////// ////// //////
    ////// ////// ////// ////// ////// /////// ////// ////// ////// ////// //////

    //Re-lock Code and info layer
    codeInfoLayer.locked = true;

    // Set up title boxes
    function titleBoxSetup(x, y, width, height, content) {
        var titleBox = myPage.textFrames.add({
            geometricBounds    : [y, x, y + height, x + width],
            appliedObjectStyle : docToSetup.objectStyles.itemByName("SLUG TEXTBOXES")
        });

        titleBox.contents = content;
    }
    
    // Set up input boxes
    function inputBoxSetup(x, y, width, height, labelName) {
        var inputBox = myPage.textFrames.add({
            geometricBounds    : [y, x, y + height, x + width],
            appliedObjectStyle : docToSetup.objectStyles.itemByName("SLUG TEXTBOXES")
        })

        // textFrame is an object, labelName is a string
        if(labelName === "codeInput") {
            inputBox.textVariableInstances.add({associatedTextVariable:varFileName});
        
        } else if(labelName === "dimsInput") {
            inputBox.textVariableInstances.add({associatedTextVariable:varDims});
    
        } else if(labelName === "batchReviewInput"){
            if(sampleCheck.value) {
                inputBox.contents = "SAMPLE - Review " + reviewEditText.text;
            } else if(fabCheck.value) {
                inputBox.contents = "Batch " + batchEditText.text + " - " + "TO " + fabEditText.text.toUpperCase();
            } else { 
                inputBox.contents = "Batch " + batchEditText.text + " - " + "Review " + reviewEditText.text;
            }
        
        } else if(labelName === "dateInput"){
            inputBox.contents = dateEditText.text;
        
        } else {
            inputBox.contents = notesEditText.text;
        }
    
        inputBox.label = labelName;
    }

    function layoutTextRegular() {
        var addNotes = notesCheck.value;

        // Decide on how to setup
        var maxCol, maxRow;
        if (pageWidth <= BREAKPOINT.2) {
            // stack everything
            maxCol = 1;
            maxRow = addNotes ? 5 : 4;
        } else if (pageWidth <= BREAKPOINT.1) {
            // add notes to the bottom
            maxCol = 2;
            maxRow = 2;
        } else {
            // really wide panel, so keep everything as is
            maxCol addNotes ? 3 : 2;
            maxRow = 2;
        }
        
        var counter = 0;
        var titleX = 0;
        var inputX = titleX + 80;

        for (var col = 0; col < maxCol; col++) {
            var y = -144;

            var inputWidth;
            if (maxCol === 1) {
                inputWidth = inputX - 
            }

            for (var row = 0; row < maxRow; row++) {
                titleBoxSetup(titleX, y, titleBoxData.height, titleBoxData.width, titleBoxData.counter);
                inputBoxSetup(inputX, y, inputHeight, inputWidth, inputBoxData.counter);

                counter++;

                if (maxCol === 1) {
                    y += (counter === 3) ? pageHeight + 3 : 54;
                } else if (maxCol === 2) {
                    y += (counter === 5) ? 
                } else {
                    y += 54 ;
                }
            }

            if (maxCol > 1) {
                titleX += (col < 1) ? 330 : 390;
                // HERE
            }
        }

        /* for (var col = 0; col < maxCol; col++) { */
        /*     // Notes column (col = 2) gets 1 row */
        /*     /1* var rows = (col < 2) ? 2 : 1; *1/ */

        /*     /1* if max col 1: *1/ */
        /*     /1*     row < 2: *1/ */
        /*     /1*         add up top *1/ */
        /*     /1*     else: *1/ */
        /*     /1*         add below *1/ */
        /*     /1*     if add notes: *1/ */
        /*     /1*         add below *1/ */

        /*     /1* else if max col 2: *1/ */
        /*     /1*     col < 2: *1/ */
        /*     /1*         maxrows =2 *1/ */
        /*     /1*         add col *1/ */
                
        /*     /1*     if add notes: *1/ */
        /*     /1*         maxrows = 1 *1/ */
        /*     /1*         add 3rd col below *1/ */

        /*     /1* else: *1/ */
        /*     /1*     col < 2: *1/ */
        /*     /1*         maxrows = 2 *1/ */
        /*     /1*         add col *1/ */
        /*     /1*     if add notes: *1/ */
        /*     /1*         maxrows = 1 *1/ */
        /*     /1*         add 3rd col *1/ */

        /*     var inputX = titleX + 80; */
        /*     var y = -144; */

        /*     var inputWidth; */
        /*     if (col < 1) { */
        /*         inputWidth = inputX + inputBoxData.width1; */
        /*     } else if (col < 2) { */
        /*         var maxWidth = inputX + inputBoxData.width2; */
        /*         inputWidth = (pageWidth < maxWidth) ? pageWidth + BLEEDDIM : maxWidth; */
        /*     } else { */
        /*         // Use narrower value: pageWidth or maxWidth (650pt) */
        /*         // This will "clip" the inputWidth to the edge of page if 650pt exceeds the page */
        /*         var maxWidth = inputX + inputBoxData.width3; */
        /*         inputWidth = (pageWidth < maxWidth) ? pageWidth : maxWidth; */
        /*     } */

        /*     for (var row = 0; row < maxRow; row++) { */
        /*         // Notes column has taller input box */
        /*         var inputHeight = (col < 2) ? y + inputBoxData.height : y + inputBoxData.height * 4; */

        /*         var titleBox = myPage.textFrames.add({ */
        /*             geometricBounds: [y, titleX, y + titleBoxData.height, titleX + titleBoxData.width], */
        /*             appliedObjectStyle: docToSetup.objectStyles.itemByName("SLUG TEXTBOXES") */
        /*         }); */

        /*         var inputBox = myPage.textFrames.add({ */
        /*             geometricBounds: [y, inputX, inputHeight, inputWidth], */
        /*             appliedObjectStyle: docToSetup.objectStyles.itemByName("SLUG TEXTBOXES") */
        /*         }); */

        /*         titleBoxSetup(titleBox, titleBoxData[counter]); */
        /*         inputBoxSetup(inputBox, inputBoxData[counter]); */
                
        /*         // Next row is has 54pts offset */
        /*         y += 48; */
        /*         counter++; */
        /*     } */

        /*     // Notes column has 410pt offset from previous column */
        /*     titleX += (col < 1) ? 330 : 390; */
        /* } */
    }
}

