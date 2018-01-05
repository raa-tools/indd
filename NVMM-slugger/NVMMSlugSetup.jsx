//Just in case this little script gets lost in the woods:
#target InDesign


// GLOBAL VARIABLES – CHANGE PER PROJECT AS NECESSARY
BLEEDDIM = 36;
SLUGDIM = 144;

FONT = {
    FAMILY  : "Nitti Grotesk",
    WEIGHT1 : "Light",
    WEIGHT2 : "Bold"
};

////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
////// ////// /////        —   What the file    —       ////// ////// //////
////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 

//Allow the user to select a folder of INDD layout files
//and establish variables for the folder and each individual file,
var myFolder = Folder.selectDialog("*****     Please select a folder of panels     *****");

// Use try/catch in case user cancels out of folder select dialog
try{
    var myInddFiles = myFolder.getFiles("*.indd");
    main();

} catch(error) {
    $.writeln(error);
    if(error instanceof TypeError) {
        alert("No folder selected");
    }
}

// Using a main() function so the entire try block above isn't super long...
function main() {
    // These are declared here so they can be used by dialogSetup()
    var myWindow; var batchEditText; var reviewEditText; var dateEditText;

    dialogSetup();

    if(myWindow.show() == true) {
        //Establish a loop to deal with all the files:
        for(k=0; k<myInddFiles.length; k++) {
        
            ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
            ////// ////// /////      —    Document  Business     —      ///// ////// //////
            ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
            
            //Doc setup
            var myDocument = app.open(myInddFiles[k]);
            var myPage = app.activeWindow.activePage;
    
            app.scriptPreferences.measurementUnit = MeasurementUnits.inches;
            var pageWidth = Math.round(1000*myDocument.documentPreferences.pageWidth)/1000; 
            var pageHeight = Math.round(1000*myDocument.documentPreferences.pageHeight)/1000;
            var pageDims =  pageWidth + " × " + pageHeight + " in.";
            
            app.scriptPreferences.measurementUnit = MeasurementUnits.points;

            //Reset the Zero Point/Ruler to top left corner
            myDocument.zeroPoint = [0,0];
        
            //Set bleed and slug dims
            myDocument.documentPreferences.properties = {
                documentBleedBottomOffset : BLEEDDIM ,
                documentBleedTopOffset : BLEEDDIM ,
                documentBleedInsideOrLeftOffset : BLEEDDIM ,
                documentBleedOutsideOrRightOffset : BLEEDDIM,
                slugBottomOffset : SLUGDIM,
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
                3 : "Date"
            };

            var inputBoxData = {
                width  : 326,
                height : 35,

                0 : "codeInput",
                1 : "dimsInput",
                2 : "batchReviewInput",
                3 : "dateInput"
            };
            
            var counter = 0;

            for(var col = 0; col < 2; col++) {
                var titleBoxX = 454 * col;
                var inputBoxX = titleBoxX + 113;

                for(var row = 0; row < 2; row++) {
                    var titleBoxY = 54 * row -110;
                    var inputBoxY = titleBoxY - 15;

                    var titleBox = myPage.textFrames.add({geometricBounds: [titleBoxY, titleBoxX, titleBoxY + titleBoxData.height, titleBoxX + titleBoxData.width]});
                    titleBoxSetup(titleBox, titleBoxData[counter]);

                    var inputBox = myPage.textFrames.add({geometricBounds: [inputBoxY, inputBoxX, inputBoxY + inputBoxData.height, inputBoxX + inputBoxData.width]});
                    inputBoxSetup(inputBox, inputBoxData[counter]);

                    counter++;
                }
            }    
            
        
            ////// ////// ////// ////// //////  ////// ////// ////// ////// ////// ////// 
            ////// ////// ////// //// —  Apply all the things  —  //// ////// ////// ////
            ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
        
            var codeInfoFrames = codeInfoLayer.textFrames;
    
            for(var z = 0; z < codeInfoFrames.length; z++) {
                codeInfoFrames[z].appliedObjectStyle = myDocument.objectStyles.item("[None]");
                codeInfoFrames[z].textFramePreferences.verticalJustification = VerticalJustification.BOTTOM_ALIGN;


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
    
            
            ////// ////// ////// ////// //////  ////// ////// ////// ////// ////// ////// 
            ////// ////// ////// //// —  THE END IS NIGH   —  //// ////// ////// //////
            ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
        
            //Re-lock Code and info layer
            codeInfoLayer.locked = true;
        
            //save file
            myDocument.save();
        
            //close file
            myDocument.close();
        }
        
        alert("Oh, did you just blink? \rYou missed a lot of fun.\r" + myInddFiles.length + " files processed.");
    
    } else {
        app.dialogs.everyItem().destroy()
    }
    

    function dialogSetup() {
        var today = getTodaysDate();

        myWindow = new Window("dialog", "Panels are CHILL");

        // Row 1
        var inputRow1 = myWindow.add("group {alignment: 'left'}");
        
        // Batch
        var batchStaticText = inputRow1.add('statictext {text: "Batch:", size: [40, 24], alignment: "bottom", justify: "right"}');
        batchEditText = inputRow1.add('edittext {text: "1", size: [40, 25], active: true}');
        
        var reviewStaticText = inputRow1.add('statictext {text: "Review:", size: [55, 24], alignment: "bottom", justify: "right"}');
        reviewEditText = inputRow1.add('edittext {text: "1", size: [40, 25]}');

        // Row 2
        var inputRow2 = myWindow.add('group {alignment: "left"}');

        // Date
        var dateStaticText = inputRow2.add("statictext {text: 'Date:', size: [40, 24], alignment: 'bottom', justify: 'right'}");
        dateEditText = inputRow2.add("edittext {size: [155, 25]}");
        dateEditText.text = today;
        
        // Buttons
        var buttonGroup = myWindow.add("group {alignment: 'right'}");
        buttonGroup.add ("button", undefined, "OK");
        buttonGroup.add ("button", undefined, "Cancel");
    }


    function getTodaysDate() {
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];    
        var timeStamp = new Date();

        return monthNames[timeStamp.getMonth()] + " " + timeStamp.getDate() + ", " + timeStamp.getFullYear();
    }


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
            textFrame.contents = "Batch " + batchEditText.text + " - " + "Review " + reviewEditText.text;
        
        } else {
            textFrame.contents = dateEditText.text;
        }
    
        textFrame.label = labelName;
    }
}