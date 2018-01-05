//Just in case this little script gets lost in the woods:
#target InDesign 


////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
//////   —   Change Text Defaults in this section as necessary   —    //////
////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 

var inputText1 = "Batch # - Review #";
var inputText2 = "Month ##, ####";


////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
////// —   Change bleed + slug dim in this section as necessary   — //////
////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 

//Establish page dimensions as a variable
var my_bleedDim = 36;
var my_slug = 144;


////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
////// ////// /////        —   What the file    —       ////// ////// //////
////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 

//Allow the user to select a folder of INDD layout files
//and establish variables for the folder and each individual file,
var myFolder = Folder.selectDialog("*****     Please select a folder of panels     *****");

// Use try/catch in case user cancels out of folder select dialog
try{
    main();

} catch(error) {
    alert("No folder selected");
}


function main() {
    var myInddFiles = myFolder.getFiles("*.indd"); 

    ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
    ////// —  Change dimension values in this section as necessary  — //////
    ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
    
    // Box dimensions
    var smallBoxWidth = 100;
    var smallBoxHeight = 20;
    var bigBoxWidth = 326;
    var bigBoxHeight = 35;
    
    // Box locations
    var titleBoxPos = {
        x1 : 0,
        y1 : -110,
        x2 : 454,
        y2 : -56
    };
    
    var inputBoxPos = {
        x1 : 113,
        y1 : -125,
        x2 : 567,
        y2 : -71
    };
    
    
    ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
    ////// ////// /////  —   D i a l o g   B u s i n e s s    —     ///// ////// //////
    ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
    
    var myWindow = new Window("dialog", "Panels are CHILL");
    
    //Set up text fields
    var myInputGroup1 = myWindow.add("group");
    myInputGroup1.alignment = "right";
    myInputGroup1.add("statictext", undefined, "Review:");
    
    var myTextEditField1 = myInputGroup1.add("edittext", undefined, inputText1);
    myTextEditField1.characters = 50;
    myTextEditField1.active = true;
    
    var myInputGroup2 = myWindow.add("group");
    myInputGroup2.alignment = "right";
    myInputGroup2.add("statictext", undefined, "Date:");
    
    var myTextEditField2 = myInputGroup2.add("edittext", undefined, inputText2);
    myTextEditField2.characters = 50;
    
    ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
    
    //Set up and display the dialog buttons
    var myButtonGroup = myWindow.add ("group");
    myButtonGroup.alignment = "right";
    myButtonGroup.add ("button", undefined, "OK");
    myButtonGroup.add ("button", undefined, "Cancel");
    
    
    ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
    
    
    if (myWindow.show () === true) {
        //Capture text input
        var myString1 = myTextEditField1.text;
        var myString2 = myTextEditField2.text;
    
        ////// — MAIN Script — //////
    
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
                documentBleedBottomOffset : my_bleedDim ,
                documentBleedTopOffset : my_bleedDim ,
                documentBleedInsideOrLeftOffset : my_bleedDim ,
                documentBleedOutsideOrRightOffset : my_bleedDim,
                slugBottomOffset : my_slug,
                slugTopOffset : my_slug,
                slugInsideOrLeftOffset : my_slug,
                slugRightOrOutsideOffset : my_slug,
            };
    
            // Add text variables for File Name & Dimensions
            var varFileName = myDocument.textVariables.item("File Name");
            var varDims = myDocument.textVariables.item("Dimensions");
    
            // Check if variable text item exists and is the right type
            // If not, add one
            if(!varDims.isValid || varDims.variableType !== VariableTypes.CUSTOM_TEXT_TYPE) {
                varDims = doc.textVariables.add();
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
                appliedFont = app.fonts.itemByName("Times New Roman");
                fontStyle = "Regular";
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
                appliedFont = app.fonts.itemByName("Times New Roman");
                fontStyle = "Regular";
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
                appliedFont = app.fonts.itemByName("Times New Roman");
                fontStyle = "Bold";
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
            ////// //////   —   Set Up the three kinds of Text Boxes   —    ////// //////
            ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
        
            // Title boxes. Is object literal + for loop better than semi-manual?
            // 0 – 3 are title boxes; 4 – 7 are input boxes
            var slugBoxInfo = {
                0 : {
                    bounds : [titleBoxPos.y1, titleBoxPos.x1, titleBoxPos.y1 + smallBoxHeight, titleBoxPos.x1 + smallBoxWidth], 
                    text   : "Code"
                },
                
                1 : { 
                    bounds : [titleBoxPos.y2, titleBoxPos.x1, titleBoxPos.y2 + smallBoxHeight, titleBoxPos.x1 + smallBoxWidth], 
                    text   : "w × h"
                },
    
                2 : {
                    bounds : [titleBoxPos.y1, titleBoxPos.x2, titleBoxPos.y1 + smallBoxHeight, titleBoxPos.x2 + smallBoxWidth], 
                    text   : "Review"
                },
    
                3 : {
                    bounds : [titleBoxPos.y2, titleBoxPos.x2, titleBoxPos.y2 + smallBoxHeight, titleBoxPos.x2 + smallBoxWidth], 
                    text   : "Date"
                },
    
                4 : {
                    bounds : [inputBoxPos.y1, inputBoxPos.x1, inputBoxPos.y1 + bigBoxHeight, inputBoxPos.x1 + bigBoxWidth], 
                    label  : "codeInput"
                },
    
                5 : {
                    bounds : [inputBoxPos.y2, inputBoxPos.x1, inputBoxPos.y2 + bigBoxHeight, inputBoxPos.x1 + bigBoxWidth], 
                    label  : "dimsInput"
                },
    
                6 : {
                    bounds : [inputBoxPos.y1, inputBoxPos.x2, inputBoxPos.y1 + bigBoxHeight, inputBoxPos.x2 + bigBoxWidth], 
                    label  : "reviewInput"
                },
    
                7 : {
                    bounds : [inputBoxPos.y2, inputBoxPos.x2, inputBoxPos.y2 + bigBoxHeight, inputBoxPos.x2 + bigBoxWidth], 
                    label  : "dateInput"
                }
    
            };
    
            for(var l = 0; l < 8; l++) {
                if(l < 4) {
                    var titleBox = myPage.textFrames.add({geometricBounds: slugBoxInfo[l].bounds});
                    titleBoxSetup(titleBox, slugBoxInfo[l].text);
    
                } else {
                    var inputBox = myPage.textFrames.add({geometricBounds: slugBoxInfo[l].bounds});
                    inputBoxSetup(inputBox, slugBoxInfo[l].label);
                }
            }
            
        
            ////// ////// ////// ////// //////  ////// ////// ////// ////// ////// ////// 
            ////// ////// ////// //// —  Apply all the things  —  //// ////// ////// ////
            ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
        
            var codeInfoFrames = myDocument.layers.item("Code and info").textFrames;
    
            for(var z = 0; z < codeInfoFrames.length; z++) {
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
            myDocument.layers.item("Code and info").locked = true;
        
            //save file
            myDocument.save();
        
            //close file
            myDocument.close();
        }
        
        alert("Oh, did you just blink? \rYou missed a lot of fun.\r" + myInddFiles.length + " files processed.");
    
    } else {
        app.dialogs.everyItem().destroy()
    }
    
    function titleBoxSetup(textFrame, content) {
        // textFrame is an object, content is a string
        textFrame.contents = content;
        textFrame.textFramePreferences.verticalJustification = VerticalJustification.BOTTOM_ALIGN;               
    }
    
    function inputBoxSetup(textFrame, labelName) {
        // textFrame is an object, labelName is a string
        if(labelName === "codeInput") {
            textFrame.textVariableInstances.add({associatedTextVariable:varFileName});
        
        } else if(labelName === "dimsInput") {
            textFrame.textVariableInstances.add({associatedTextVariable:varDims});
    
        } else if(labelName === "reviewInput"){
            textFrame.contents = myString1;
        
        } else {
            textFrame.contents = myString2;
        }
    
        textFrame.textFramePreferences.verticalJustification = VerticalJustification.BOTTOM_ALIGN;
        textFrame.label = labelName;
    }
    
}