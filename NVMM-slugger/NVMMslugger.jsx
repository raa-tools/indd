//Just in case this little script gets lost in the woods:
#target InDesign 


////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
//////   —   Change Text Defaults in this section as necessary   —    //////
////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 

var inputText1 = "Dims";
var inputText2 = "BATCH # - REVIEW #";
var inputText3 = "SUBMISSION DATE";


////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
////// —   Change bleed + slug dim in this section as necessary   — //////
////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 

//Establish page dimensions as a variable
var my_bleedDim = 36;
var my_slug = 200;


////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
////// ////// /////             —   What the file    —              ///// ////// //////
////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 

//Allow the user to select a folder of INDD layout files
//and establish variables for the folder and each individual file,
var myFolder = Folder.selectDialog("*****     Please select a folder of panels     *****");  
var myInddFiles = myFolder.getFiles("*.indd"); 


////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
//////   —   Page Dims are now defined by Dropdown Selection   —  //////
////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 

//Establish page dimensions as a variable
// var my_pageWidth = selectedPanelType.width;
// var my_pageHeight = selectedPanelType.height;
var my_pageWidth = 1000;
var my_pageHeight = 500;


////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
////// —  Change dimension values in this section as necessary  — //////
////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 

// Box dimensions
var smallBoxWidth = 100;
var smallBoxHeight = 20;
var bigBoxWidth = 326;
var bigBoxHeight = 35;

var titleBoxPos = {
    x1 : -36,
    y1 : -110,
    x2 : 418,
    y2 : -56
};

var inputBoxPos = {
    x1 : 77,
    y1 : -125,
    x2 : 531,
    y2 : -71
};


////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
////// ////// /////  —   D i a l o g   B u s i n e s s    —     ///// ////// //////
////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 

var myWindow = new Window("dialog", "Panels are CHILL");

//Set up text fields
var myInputGroup1 = myWindow.add("group");
myInputGroup1.alignment = "right";
myInputGroup1.add("statictext", undefined, "W x H:");

var myTextEditField1 = myInputGroup1.add("edittext", undefined, inputText1);
myTextEditField1.characters = 50;

var myInputGroup2 = myWindow.add("group");
myInputGroup2.alignment = "right";
myInputGroup2.add("statictext", undefined, "Review:");

var myTextEditField2 = myInputGroup2.add("edittext", undefined, inputText2);
myTextEditField2.characters = 50;
myTextEditField2.active = true;

var myInputGroup3 = myWindow.add("group");
myInputGroup3.alignment = "right";
myInputGroup3.add("statictext", undefined, "Date:");

var myTextEditField3 = myInputGroup3.add("edittext", undefined, inputText3);
myTextEditField3.characters = 50;


////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 

//Set up and display the dialog buttons
var myButtonGroup = myWindow.add ("group");
myButtonGroup.alignment = "right";
myButtonGroup.add ("button", undefined, "OK");
myButtonGroup.add ("button", undefined, "Cancel");


////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 


if (myWindow.show () == true) {
    //Capture text input
    var myString1 = myTextEditField1.text;
    var myString2 = myTextEditField2.text;
    var myString3 = myTextEditField3.text;

    ////// — MAIN Script — //////

    //Establish a loop to deal with all the files:
    for(k=0; k<myInddFiles.length; k++) {
    
    
        ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
        ////// ////// /////      —    Document  Business     —      ///// ////// //////
        ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
        
        //Doc setup
        var myDocument = app.open(myInddFiles[k]);
        var myPage = app.activeWindow.activePage;
        
        app.scriptPreferences.measurementUnit = MeasurementUnits.points;
    
        //Reset the Zero Point/Ruler to top left corner
        app.activeDocument.zeroPoint = [0,0];
    
        //Set page dimensions
        app.activeDocument.documentPreferences.properties = {
            // pageHeight : my_pageHeight ,
            // pageWidth : my_pageWidth ,
            documentBleedBottomOffset : my_bleedDim ,
            documentBleedTopOffset : my_bleedDim ,
            documentBleedInsideOrLeftOffset : my_bleedDim ,
            documentBleedOutsideOrRightOffset : my_bleedDim,
            slugBottomOffset : my_slug,
            slugTopOffset : my_slug,
            slugInsideOrLeftOffset : my_slug,
            slugRightOrOutsideOffset : my_slug,
        };
    
    
        ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
        ////// //////   —   Document Layer and Style Clean-up    —   ////// //////
        ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
    
        try {
            app.activeDocument.layers.item("Code and info").remove();
            
            //create new “Code and info” layer and move to top
            newCodeLayer = app.activeDocument.layers.add({name: "Code and info"});
            newCodeLayer.move(LocationOptions.BEFORE, app.activeDocument.layers[0]);    
            
            }
    
        catch (whatWeWantIsNotActuallyAnErrorButHeyWeWillTakeIt){
             //create new “Code and info” layer and move to top
            newCodeLayer = app.activeDocument.layers.add({name: "Code and info"});
            newCodeLayer.move(LocationOptions.BEFORE, app.activeDocument.layers[0]);    
            
            }
    
        var old_CODE_NOTE_characterStyle = app.activeDocument.characterStyles.item("Code Note");
        try {
            //check to see if the style exists. if it does, delete it
            var myCleanUpName1 = old_CODE_NOTE_characterStyle.name;
            old_CODE_NOTE_characterStyle.remove();
        }
        catch (myError){
            //the character style did not exist, so no problem
        }
    
        var old_CODE_LIGHT_characterStyle = app.activeDocument.characterStyles.item("Code Light");
        try {
            //check to see if the style exists. if it does, delete it
            var myCleanUpName2 = old_CODE_LIGHT_characterStyle.name;
            old_CODE_LIGHT_characterStyle.remove();
        }
        catch (myError){
            //the character style did not exist, so no problem
        }
    
        var old_CODE_BOLD_characterStyle = app.activeDocument.characterStyles.item("Code Bold");
        try {
            //check to see if the style exists. if it does, delete it
            var myCleanUpName3 = old_CODE_BOLD_characterStyle.name;
            old_CODE_BOLD_characterStyle.remove();
        }
        catch (myError){
            //the character style did not exist, so no problem
        }
    
    
    
        ////// ////// ////// ////// //////  ////// ////// ////// ////// ////// ////// 
        //   —   Establish Paragraph and Character Styles needed for Slug   —    //
        ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
    
        var my_CODE_NOTE_characterStyle = app.activeDocument.characterStyles.item("New Code Note");
        try {
            //check to see if the style exists. if it does, delete it and add a fresh version
            var myName1 = my_CODE_NOTE_characterStyle.name;
            my_CODE_NOTE_characterStyle.remove();
            var my_CODE_NOTE_characterStyle = app.activeDocument.characterStyles.add({name:"New Code Note"});
        }
        catch (myError){
        //The paragraph style did not exist, so create it
        var my_CODE_NOTE_characterStyle = app.activeDocument.characterStyles.add({name:"New Code Note"});
        }
    
        with(my_CODE_NOTE_characterStyle){
    
            //Formatting the Character text style
            basedOn = "None";
            appliedFont = app.fonts.itemByName("Times New Roman");
            fontStyle = "Light";
            pointSize = 14;
            tracking = 25;
            capitalization = Capitalization.allCaps;
            fillTint = 50;
    
        }
    
        //Set up "New Code Light" Character Style
        var my_CODE_LIGHT_characterStyle = app.activeDocument.characterStyles.item("New Code Light");
        try {
            //check to see if the style exists. if it does, delete it and add a fresh version
            var myName2 = my_CODE_LIGHT_characterStyle.name;
            my_CODE_LIGHT_characterStyle.remove();
            var my_CODE_LIGHT_characterStyle = app.activeDocument.characterStyles.add({name:"New Code Light"});
        }
        catch (myError){
        //The paragraph style did not exist, so create it
        var my_CODE_LIGHT_characterStyle = app.activeDocument.characterStyles.add({name:"New Code Light"});
        }
    
        with(my_CODE_LIGHT_characterStyle){
    
            //Formatting the Character text style
            basedOn = "None";
            appliedFont = app.fonts.itemByName("Times New Roman");
            fontStyle = "Light";
            pointSize = 32;
            tracking = 0;
            capitalization = Capitalization.normal;
            fillTint = 100;
    
        }
    
    
        //Set up "New Code Bold" Paragraph Style
        var my_CODE_BOLD_paragraphStyle = app.activeDocument.paragraphStyles.item("New Code Bold");
        try {
            //check to see if the style exists. if it does, delete it and add a fresh version
            var myName3 = my_CODE_BOLD_paragraphStyle.name;
            my_CODE_BOLD_paragraphStyle.remove();
            var my_CODE_BOLD_paragraphStyle = app.activeDocument.paragraphStyles.add({name:"New Code Bold"});
        }
        catch (myError){
            //The paragraph style did not exist, so create it
            var my_CODE_BOLD_paragraphStyle = app.activeDocument.paragraphStyles.add({name:"New Code Bold"});
        }
    
        //Set up New "Yellow Highlight" Swatch Color
        var myColor = app.activeDocument.colors.item("Yellow Highlight")
        try {
            var myName = myColor.name;
        }
        catch (myError){
            //The color swatch did not exist, so create it
            myColor = app.activeDocument.colors.add({name:"Yellow Highlight", model:ColorModel.process, colorValue:[0,0,100,0]});
        }
    
        with(my_CODE_BOLD_paragraphStyle){
    
            //Formatting the paragraph text style
            nextParagraphStyle = "None";
            appliedFont = app.fonts.itemByName("Times New Roman");
            fontStyle = "Bold";
            pointSize = 32;
            //spaceAfter = 24;
            //spaceBefore = 24;
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
    
    
        //Set up Text Frames and set Text Variables to be styled (later)
        var codeTitleBox_TextFrame = myPage.textFrames.add({geometricBounds:[titleBoxPos.y1, titleBoxPos.x1, titleBoxPos.y1 + smallBoxHeight, titleBoxPos.x1 + smallBoxWidth]});
        codeTitleBox_TextFrame.contents = "Code";
        codeTitleBox_TextFrame.textFramePreferences.verticalJustification = VerticalJustification.BOTTOM_ALIGN;
    
        var codeTitle = codeTitleBox_TextFrame.parentStory;
    
        var dimsTitleBox_TextFrame = myPage.textFrames.add({geometricBounds:[titleBoxPos.y2, titleBoxPos.x1, titleBoxPos.y2 + smallBoxHeight, titleBoxPos.x1 + smallBoxWidth]});
        dimsTitleBox_TextFrame.contents = "w × h";
        dimsTitleBox_TextFrame.textFramePreferences.verticalJustification = VerticalJustification.BOTTOM_ALIGN;
    
        var dimsTitle = dimsTitleBox_TextFrame.parentStory;
    
        var reviewTitleBox_TextFrame = myPage.textFrames.add({geometricBounds:[titleBoxPos.y1, titleBoxPos.x2, titleBoxPos.y1 + smallBoxHeight, titleBoxPos.x2 + smallBoxWidth]});
        reviewTitleBox_TextFrame.contents = "Review";
        reviewTitleBox_TextFrame.textFramePreferences.verticalJustification = VerticalJustification.BOTTOM_ALIGN;
    
        var reviewTitle = reviewTitleBox_TextFrame.parentStory;
    
        var dateTitleBox_TextFrame = myPage.textFrames.add({geometricBounds:[titleBoxPos.y2, titleBoxPos.x2, titleBoxPos.y2 + smallBoxHeight, titleBoxPos.x2 + smallBoxWidth]});
        dateTitleBox_TextFrame.contents = "Date";
        dateTitleBox_TextFrame.textFramePreferences.verticalJustification = VerticalJustification.BOTTOM_ALIGN;
    
        var dateTitle = dateTitleBox_TextFrame.parentStory;
    
    
        ///////// Text Variable Box  --  5 /////////
    
        //Set up Text Frames and set Text Variables to be styled (later)
        var codeInputBox_TextFrame = myPage.textFrames.add({geometricBounds:[inputBoxPos.y1, inputBoxPos.x1, inputBoxPos.y1 + bigBoxHeight, inputBoxPos.x1 + bigBoxWidth]});
        myVariable = myDocument.textVariables.item("File Name");
        codeInputBox_TextFrame.textVariableInstances.add({associatedTextVariable:myVariable});
        codeInputBox_TextFrame.textFramePreferences.verticalJustification = VerticalJustification.BOTTOM_ALIGN;
        codeInputBox_TextFrame.label = "codeInput"
    
        var codeInput = codeInputBox_TextFrame.parentStory;
    
        //Set up Text Frames and set Text Variables to be styled (later)
        var dimsInputBox_TextFrame = myPage.textFrames.add({geometricBounds:[inputBoxPos.y2, inputBoxPos.x1, inputBoxPos.y2 + bigBoxHeight, inputBoxPos.x1 + bigBoxWidth]});
        dimsInputBox_TextFrame.contents = myString1;
        dimsInputBox_TextFrame.textFramePreferences.verticalJustification = VerticalJustification.BOTTOM_ALIGN;
        dimsInputBox_TextFrame.label = "dimsInput"
    
        var dimsInput = dimsInputBox_TextFrame.parentStory;
    
        var reviewInputBox_TextFrame = myPage.textFrames.add({geometricBounds:[inputBoxPos.y1, inputBoxPos.x2, inputBoxPos.y1 + bigBoxHeight, inputBoxPos.x2 + bigBoxWidth]});
        reviewInputBox_TextFrame.contents = myString2;
        reviewInputBox_TextFrame.textFramePreferences.verticalJustification = VerticalJustification.BOTTOM_ALIGN;
        reviewInputBox_TextFrame.label = "reviewInput"
    
        var reviewInput = reviewInputBox_TextFrame.parentStory;
    
        var dateInputBox_TextFrame = myPage.textFrames.add({geometricBounds:[inputBoxPos.y2, inputBoxPos.x2, inputBoxPos.y2 + bigBoxHeight, inputBoxPos.x2 + bigBoxWidth]});
        dateInputBox_TextFrame.contents = myString3;
        dateInputBox_TextFrame.textFramePreferences.verticalJustification = VerticalJustification.BOTTOM_ALIGN;
        dateInputBox_TextFrame.label = "dateInput"
    
        var dateInput = dateInputBox_TextFrame.parentStory;
    
    
        ////// ////// ////// ////// //////  ////// ////// ////// ////// ////// ////// 
        ////// ////// ////// //// —  Apply all the things  —  //// ////// ////// ////
        ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
    
        var codeInfoFrames = myDocument.layers.item("Code and info").textFrames;

        for(var z = 0; z < codeInfoFrames.length; z++) {
            if(codeInfoFrames[z].label === "codeInput") {
                var frameStory = codeInfoFrames[z].parentStory;

                frameStory.appliedCharacterStyle = app.activeDocument.characterStyles.item("[None]");
                frameStory.appliedParagraphStyle = my_CODE_BOLD_paragraphStyle;
                frameStory.justification = Justification.LEFT_ALIGN;
            
            } else if(codeInfoFrames[z].label.indexOf("Input") !== -1 && codeInfoFrames[z].label.indexOf("code") === -1) {
                var frameStory = codeInfoFrames[z].parentStory;

                frameStory.appliedCharacterStyle = my_CODE_LIGHT_characterStyle;
                frameStory.appliedParagraphStyle = app.activeDocument.paragraphStyles.item("[Basic Paragraph]");
                frameStory.justification = Justification.LEFT_ALIGN;
            
            } else {
                var frameStory = codeInfoFrames[z].parentStory;

                frameStory.appliedCharacterStyle = my_CODE_NOTE_characterStyle;
                frameStory.appliedParagraphStyle = app.activeDocument.paragraphStyles.item("[Basic Paragraph]");
                frameStory.justification = Justification.RIGHT_ALIGN;
                
            }
        }

        
        ////// ////// ////// ////// //////  ////// ////// ////// ////// ////// ////// 
        ////// ////// ////// //// —  THE END IS NIGH   —  //// ////// ////// //////
        ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
    
        //Re-lock Code and info layer
        app.activeDocument.layers.item("Code and info").locked = true;
    
        //save file
        app.activeDocument.save();
    
        //close file
        app.activeDocument.close();
    }
    
    alert("Oh, did you just blink? \rYou missed a lot of fun.\r" + myInddFiles.length + " files processed.");

} else {
    app.dialogs.everyItem().destroy()
}
