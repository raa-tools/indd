﻿/*
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

As of 2/1/2018, this script only works on activeDocument.
To process a batch of files, run this through RoadRunner.
*/

//Just in case this little script gets lost in the woods:
#target InDesign

// GLOBAL VARIABLES – CHANGE PER PROJECT AS NECESSARY
BLEEDDIM = 36;
SLUGDIM = 144;

// Maybe this should just be a system font...
FONT = {
    FAMILY  : "Helvetica",
    WEIGHT1 : "Light",
    WEIGHT2 : "Bold"
};

try{
    // These are declared here so they can be used by dialogSetup()
    var myWindow; var batchEditText; var reviewEditText; var dateEditText;
    var fabCheck;
    var notesCheck; var notesEditText;
    var sizeRadioRegular; var sizeRadioSmall;
    var alreadyRun;
    
    var myDocument = app.activeDocument;
    
    // Control flow to make sure UI window doesn't pop up for every
    // panel file when this script is run by roadRunner
    if(!alreadyRun) {
        alreadyRun = true;
        dialogSetup();
    
        if(myWindow.show() == true) {
            main();
            
        } else {
            app.dialogs.everyItem().destroy();
        }

    } else {
        main();
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


    // Row 2
    var inputRow2 = myWindow.add("group {alignment: 'left'}");

    // TO FABRICATOR
    fabCheck = inputRow2.add("checkbox {size: [65, 15], text: '\u00A0FAB:'}");
    fabCheck.onClick = function() {
        if(fabCheck.value) {
            fabEditText.enabled = true;
            reviewEditText.enabled = false;
            reviewEditText.text = "";
        
        } else {
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

    // Row 5
    var inputRow5 = myWindow.add("group {alignment: 'left'}");

    var sizeStaticText = inputRow5.add("statictext {text: 'Panel size:', size: [65, 13], alignment: 'top', justify: 'left'}");
    sizeRadioRegular = inputRow5.add("radiobutton{size: [75, 20], text: '\u00A0Regular'}");
    sizeRadioSmall = inputRow5.add("radiobutton{size: [65, 20], text: '\u00A0Small'}");

    sizeRadioRegular.value = true;

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
function main() {    
        ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
        ////// ////// /////      —    Document  Business     —      ///// ////// //////
        ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
        
        //Doc setup
        var myPage = app.activeWindow.activePage;

        var bottomSlug = (sizeRadioSmall.value && notesCheck.value) ? SLUGDIM * 1.75 : SLUGDIM;

        app.scriptPreferences.measurementUnit = MeasurementUnits.inches;
        var pageWidth = Math.round(1000*myDocument.documentPreferences.pageWidth)/1000; 
        var pageHeight = Math.round(1000*myDocument.documentPreferences.pageHeight)/1000;
        var pageDims =  pageWidth + " × " + pageHeight + " in.";
        
        app.scriptPreferences.measurementUnit = MeasurementUnits.points;

        //Reset the Zero Point/Ruler to top left corner
        myDocument.zeroPoint = [0,0];
    
        myDocument.documentPreferences.properties = {
          documentSlugUniformSize : false
        };

        //Set bleed and slug dims
        myDocument.documentPreferences.properties = {
            documentBleedBottomOffset : BLEEDDIM ,
            documentBleedTopOffset : BLEEDDIM ,
            documentBleedInsideOrLeftOffset : BLEEDDIM ,
            documentBleedOutsideOrRightOffset : BLEEDDIM,
            slugBottomOffset : bottomSlug,
            slugTopOffset : SLUGDIM,
            slugInsideOrLeftOffset : SLUGDIM,
            slugRightOrOutsideOffset : SLUGDIM,
        };

        // Add text variables for File Name & Dimensions
        var varFileName = myDocument.textVariables.item("File Name");
        var varDims = myDocument.textVariables.item("Dimensions");

        // Check if variable text item exists and is the right type
        // If not, add one
        if(!varDims.isValid || varDims.variableType !== VariableTypes.CUSTOM_TEXT_TYPE) {
            varDims = myDocument.textVariables.add();
            varDims.variableType = VariableTypes.CUSTOM_TEXT_TYPE;
            varDims.name = "Dimensions";
        }
        
        // Either way, insert content here
        varDims.variableOptions.contents = pageDims;

    
        ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
        ////// //////   —   Code and info layer set up    —   ////// //////
        ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
        
        var codeInfoLayer = myDocument.layers.item("Code and info");

        if(codeInfoLayer.isValid) {
            codeInfoLayer.remove();
        }

        codeInfoLayer = myDocument.layers.add({name: "Code and info"});
        codeInfoLayer.move(LocationOptions.BEFORE, myDocument.layers[0]);    
    
    
        ////// ////// ////// ////// //////  ////// ////// ////// ////// ////// ////// 
        //   —   Establish Paragraph and Character Styles needed for Slug   —    //
        ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
    
        var my_CODE_NOTE_characterStyle = myDocument.characterStyles.item("New Code Note");

        if(my_CODE_NOTE_characterStyle.isValid) {
            my_CODE_NOTE_characterStyle.remove();
        }

        my_CODE_NOTE_characterStyle = myDocument.characterStyles.add({name:"New Code Note"});

        with(my_CODE_NOTE_characterStyle){
            //Formatting the Character text style
            basedOn = "None";
            appliedFont = app.fonts.itemByName(FONT.FAMILY);
            fontStyle = FONT.WEIGHT1;
            pointSize = 14;
            tracking = 25;
            capitalization = Capitalization.allCaps;
            fillTint = 50;
        }
    
        //Set up "New Code Light" Character Style
        var my_CODE_LIGHT_characterStyle = myDocument.characterStyles.item("New Code Light");

        if(my_CODE_LIGHT_characterStyle.isValid) {
            my_CODE_LIGHT_characterStyle.remove();
        }

        my_CODE_LIGHT_characterStyle = myDocument.characterStyles.add({name:"New Code Light"});

        with(my_CODE_LIGHT_characterStyle){
            //Formatting the Character text style
            basedOn = "None";
            appliedFont = app.fonts.itemByName(FONT.FAMILY);
            fontStyle = FONT.WEIGHT1;
            pointSize = 32;
            leading = 33;
            tracking = 0;
            capitalization = Capitalization.normal;
            fillTint = 100;
        }

    
        //Set up "New Code Bold" Paragraph Style
        var my_CODE_BOLD_paragraphStyle = myDocument.paragraphStyles.item("New Code Bold");

        if(my_CODE_BOLD_paragraphStyle.isValid) {
            my_CODE_BOLD_paragraphStyle.remove();
        }
        
        my_CODE_BOLD_paragraphStyle = myDocument.paragraphStyles.add({name:"New Code Bold"});
        
        //Set up New "Yellow Highlight" Swatch Color
        var myColor = myDocument.colors.item("Yellow Highlight")

        if(!myColor.isValid) {
            myColor = myDocument.colors.add({name:"Yellow Highlight", model:ColorModel.process, colorValue:[0,0,100,0]});

        }
        
        with(my_CODE_BOLD_paragraphStyle){
            //Formatting the paragraph text style
            nextParagraphStyle = "None";
            appliedFont = app.fonts.itemByName(FONT.FAMILY);
            fontStyle = FONT.WEIGHT2;
            pointSize = 32;
            leading = 33;
            fillColor = myDocument.colors.item("Black");
            capitalization = Capitalization.allCaps;
    
            //Paragraph Rule Settings
            ruleAbove = true;
            ruleAboveLineWeight = "24pt";
    
            ruleAboveColor = myDocument.colors.item("Yellow Highlight");
            ruleAboveOverprint = false;
            ruleAboveGapColor = myDocument.swatches.item("None");
            ruleAboveGapOverprint = false;
            ruleAboveWidth = RuleWidth.textWidth;
            ruleAboveLeftIndent = 0;
    
            ruleAboveType = myDocument.strokeStyles.item("Solid");
            ruleAboveTint = 100;
            ruleAboveGapTint = 100;
            ruleAboveOffset = -1;
            ruleAboveRightIndent = 0;
        }


        ////// ////// ////// ////// //////  ////// ////// ////// ////// ////// ////// 
        ////// //////   —   Set Up Text Boxes   —    ////// //////
        ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 

        var titleBoxData = {
            width  : 100, 
            height : 20,

            0 : "Code",
            1 : "w × h",
            2 : "Review",
            3 : "Date",
            4 : "Notes",
        };

        var inputBoxData = {
            width  : 326,
            height : 35,

            0 : "codeInput",
            1 : "dimsInput",
            2 : "batchReviewInput",
            3 : "dateInput",
            4 : "notesInput",
        };

        sizeRadioRegular.value ? layoutTextRegular() : layoutTextSmall();

        ////// ////// ////// ////// //////  ////// ////// ////// ////// ////// ////// 
        ////// ////// ////// //// —  Apply all the things  —  //// ////// ////// ////
        ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
    
        var codeInfoFrames = codeInfoLayer.textFrames;

        for(var z = 0; z < codeInfoFrames.length; z++) {
            codeInfoFrames[z].appliedObjectStyle = myDocument.objectStyles.item("[None]");
            codeInfoFrames[z].textFramePreferences.verticalJustification = VerticalJustification.TOP_ALIGN;

            if(codeInfoFrames[z].label === "codeInput") {
                var frameStory = codeInfoFrames[z].parentStory;

                frameStory.appliedCharacterStyle = myDocument.characterStyles.item("[None]");
                frameStory.appliedParagraphStyle = my_CODE_BOLD_paragraphStyle;
                frameStory.justification = Justification.LEFT_ALIGN;
            
            } else if(codeInfoFrames[z].label.indexOf("Input") !== -1 && codeInfoFrames[z].label.indexOf("code") === -1) {
                var frameStory = codeInfoFrames[z].parentStory;

                frameStory.appliedCharacterStyle = my_CODE_LIGHT_characterStyle;
                frameStory.appliedParagraphStyle = myDocument.paragraphStyles.item("[Basic Paragraph]");
                frameStory.justification = Justification.LEFT_ALIGN;
            
            } else {
                var frameStory = codeInfoFrames[z].parentStory;

                frameStory.appliedCharacterStyle = my_CODE_NOTE_characterStyle;
                frameStory.appliedParagraphStyle = myDocument.paragraphStyles.item("[Basic Paragraph]");
                frameStory.justification = Justification.RIGHT_ALIGN;
            }
        }

        
        ////// ////// ////// ////// ////// /////// ////// ////// ////// ////// ////// 
        ////// ////// ////// ////   —  THE END IS NIGH  —   //// ////// ////// //////
        ////// ////// ////// ////// ////// /////// ////// ////// ////// ////// //////
    
        //Re-lock Code and info layer
        codeInfoLayer.locked = true;

    // Set up title boxes
    function titleBoxSetup(textFrame, content) {
        // textFrame is an object, content is a string
        textFrame.contents = content;
    }
    
    // Set up input boxes
    function inputBoxSetup(textFrame, labelName) {
        // textFrame is an object, labelName is a string
        if(labelName === "codeInput") {
            textFrame.textVariableInstances.add({associatedTextVariable:varFileName});
        
        } else if(labelName === "dimsInput") {
            textFrame.textVariableInstances.add({associatedTextVariable:varDims});
    
        } else if(labelName === "batchReviewInput"){
            if(!fabCheck.value) {
                textFrame.contents = "Batch " + batchEditText.text + " - " + "Review " + reviewEditText.text;
            
            } else {
                textFrame.contents = "Batch " + batchEditText.text + " - " + "TO " + fabEditText.text.toUpperCase();
            }
        
        } else if(labelName === "dateInput"){
            textFrame.contents = dateEditText.text;
        
        } else {
            textFrame.contents = notesEditText.text;
        }
    
        textFrame.label = labelName;
    }

    function layoutTextRegular() {
        var counter = 0;
        var maxCol = notesCheck.value ? 3 : 2;

        for(var col = 0; col < maxCol; col++) {
            var titleBoxX = 454 * col;
            var inputBoxX = titleBoxX + 113;
            
            var titleBoxY; var inputBoxY
            if(col < 2) {
                for(var row = 0; row < 2; row++) {
                    titleBoxY = 54 * row - 115;
                    inputBoxY = titleBoxY - 14;

                    var titleBox = myPage.textFrames.add({geometricBounds: [titleBoxY, titleBoxX, titleBoxY + titleBoxData.height, titleBoxX + titleBoxData.width]});
                    titleBoxSetup(titleBox, titleBoxData[counter]);

                    var inputBox = myPage.textFrames.add({geometricBounds: [inputBoxY, inputBoxX, inputBoxY + inputBoxData.height, inputBoxX + inputBoxData.width]});
                    inputBoxSetup(inputBox, inputBoxData[counter]);

                    counter++;
                }
            
            } else {
                titleBoxY = -115;
                inputBoxY = titleBoxY - 14;

                var titleBox = myPage.textFrames.add({geometricBounds: [titleBoxY, titleBoxX, titleBoxY + titleBoxData.height, titleBoxX + titleBoxData.width]});
                titleBoxSetup(titleBox, titleBoxData[counter]);

                var inputBox = myPage.textFrames.add({geometricBounds: [inputBoxY, inputBoxX, inputBoxY + 89, myDocument.documentPreferences.pageWidth]});
                inputBoxSetup(inputBox, inputBoxData[counter]);
            } 
        }    
    }

    function layoutTextSmall() {
        var pageHeight = myDocument.documentPreferences.pageHeight;
        var pageWidth = myDocument.documentPreferences.pageWidth;
        
        var counter = 0;
        var maxRow = notesCheck.value ? 5 : 4;

        var titleBoxX = 0;
        var inputBoxX = titleBoxX + 113;

        var titleBoxY; var inputBoxY;

        for(var row = 0; row < maxRow; row++) {
          if(row < 2) {
            titleBoxY = 54 * row - 115;
            inputBoxY = titleBoxY - 14;
          } else {
            titleBoxY = pageHeight + (54 * row - 125) + 75;
            inputBoxY = titleBoxY - 14;
          }
          var titleBox = myPage.textFrames.add({geometricBounds: [titleBoxY, titleBoxX, titleBoxY + titleBoxData.height, titleBoxX + titleBoxData.width]});
          titleBoxSetup(titleBox, titleBoxData[counter]);

          var inputBox;
          if(row < 4) {
            inputBox = myPage.textFrames.add({geometricBounds: [inputBoxY, inputBoxX, inputBoxY + inputBoxData.height, inputBoxX + pageWidth - 77]});
          } else {
            inputBox = myPage.textFrames.add({geometricBounds: [inputBoxY, inputBoxX, inputBoxY + 89, inputBoxX + pageWidth - 77]});
          }

          inputBoxSetup(inputBox, inputBoxData[counter]);

          counter++;
        }    
    }
}
