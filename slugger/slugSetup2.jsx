/*
Set up slug information for panel files.

Currently, this script will add the following panel attributes:
    * Panel code -- (File name)
    * Dimensions -- (W x H)
    * Review ------ (Batch # - Review #)
    * SAMPLE ------ (Whether panel is for sampling or not)
    * FAB --------- (Insert fabricator name)
    * Date -------- (Defaults to today's date)
    * Notes ------- (Optional)

Would be great to let user add or remove attributes from a set list.
Some extras might be:
    * Graphic Technique
    * Type of panel
    * Gallery / Area
*/

//Just in case this little script gets lost in the woods:
#target InDesign

GLOBALS = {
    SLUGDIM : 144,

    BREAKPOINT : {
        small  : 612, // 8.5in.
        medium : 1152 // 16in.
    },

    FONT : {
        family  : "Helvetica",
        weight1 : "Light",
        weight2 : "Bold",
        size1   : 22,
        size2   : 14,
        leading : 24,
    }
};

try{
    // Semi-global variables, shared between main() and setupDialog()
    var slugSetupWindow, batchEditText, reviewEditText, dateEditText;
    var sampleCheck, fabCheck; 
    var notesCheck, notesEditText;
    var bleedValue;

    // If there are files open, set up slug for active document
    if(app.documents.length !== 0) {
        var singleDoc = app.activeDocument;
        setupDialog();

        if(slugSetupWindow.show() == 1) {
            main(singleDoc);
        } else {
            exit();
        }

    // Else pick a folder of files
    } else {
        var panelFolder = Folder.selectDialog("Pick panels");
        var panelFiles = panelFolder.getFiles("*.indd");

        setupDialog();

       if(slugSetupWindow.show() == 1) {
            for(var i = 0; i < panelFiles.length; i++) {
                var panelFile = app.open(panelFiles[i]);

                main(panelFile);
                panelFile.save();
                panelFile.close();
            }

            // Add some error logging here at some point...

        } else {
            exit();
        }
    }

} catch(error) {
    alert(error);
}

/* Main function; all other document-level functions nested in here */
function main(docToSetup) {    
    // Work in pts, it's easier
    app.scriptPreferences.measurementUnit = MeasurementUnits.points;

    // Some document-level globals
    var codeInfoLayer;
    var slugObjectStyle, CODE_NOTE_charStyle, CODE_LIGHT_charStyle, CODE_BOLD_paraStyle;

    var titleBoxData = {
        width  : 60, 
        height : GLOBALS.FONT.leading,

        0 : "Code",
        1 : "w × h",
        2 : "Review",
        3 : "Date",
        4 : "Notes",
    };

    var inputBoxData = {
        width1 : 200,
        width2 : 260,
        width3 : 590,
        height : GLOBALS.FONT.leading,

        0 : "codeInput",
        1 : "dimsInput",
        2 : "batchReviewInput",
        3 : "dateInput",
        4 : "notesInput",
    };
    

    // Begin function calls
    var pages = docToSetup.pages;

    // Find narrowest width for slugBottom calculation
    var narrowestWidth = (pages.length === 1) ? calcPageDims(pages[0]).width : findNarrowestWidth(pages);

    prepDocument(narrowestWidth);
    setupStyles();

    // Make layouts for all pages
    for(var i = 0; i < pages.length; i++) {
        var pageDims = calcPageDims(pages[i]);
        makeLayout(pages[i], pageDims);
        applyStyles();
    }

    //Re-lock Code and info layer
    codeInfoLayer.locked = true;


    //////////////////////////////////////
    //                                  //
    //    FUNCTION DEFINITIONS BELOW    //
    //                                  //
    //////////////////////////////////////

    /* Setup bleed and slug area */
    function prepDocument(widthToUse) {
        // Reset the Zero Point/Ruler to top left corner
        docToSetup.zeroPoint = [0,0];

        var bottomSlug = (notesCheck.value && widthToUse <= GLOBALS.BREAKPOINT.small) ? GLOBALS.SLUGDIM * 1.75 : GLOBALS.SLUGDIM;

        docToSetup.documentPreferences.properties = {
          documentSlugUniformSize : false
        };

        //Set bleed and slug dims
        docToSetup.documentPreferences.properties = {
            documentBleedBottomOffset         : bleedValue ,
            documentBleedTopOffset            : bleedValue ,
            documentBleedInsideOrLeftOffset   : bleedValue ,
            documentBleedOutsideOrRightOffset : bleedValue,
            slugBottomOffset                  : bottomSlug,
            slugTopOffset                     : GLOBALS.SLUGDIM,
            slugInsideOrLeftOffset            : GLOBALS.SLUGDIM,
            slugRightOrOutsideOffset          : GLOBALS.SLUGDIM
        };

        // Set up "Code and info" layer
        codeInfoLayer = docToSetup.layers.item("Code and info");
        if(codeInfoLayer.isValid) {
            codeInfoLayer.remove();
        }

        codeInfoLayer = docToSetup.layers.add({name: "Code and info"});
        codeInfoLayer.move(LocationOptions.BEFORE, docToSetup.layers[0]);    
    }

    /* Setup object style, char styles, paragraph style */
    function setupStyles() {
        //Set up New "Yellow Highlight" Swatch Color
        var yellowHighlight = docToSetup.colors.item("Yellow Highlight");
        if(!yellowHighlight.isValid) {
            yellowHighlight = docToSetup.colors.add({name:"Yellow Highlight", model:ColorModel.process, colorValue:[0,0,100,0]});
        }
        
        // Object style
        // If "SLUG TEXTBOXES" style doesn't exist, make one
        if(!docToSetup.objectStyles.itemByName("SLUG TEXTBOXES").isValid) {
            slugObjectStyle = docToSetup.objectStyles.add();
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

        // code_NOTE character style
        CODE_NOTE_charStyle = docToSetup.characterStyles.item("New Code Note");
        if(CODE_NOTE_charStyle.isValid) {
            CODE_NOTE_charStyle.remove();
        }

        CODE_NOTE_charStyle = docToSetup.characterStyles.add({name:"New Code Note"});
        with(CODE_NOTE_charStyle){
            //Formatting the Character text style
            basedOn = "None";
            appliedFont = app.fonts.itemByName(GLOBALS.FONT.family);
            fontStyle = GLOBALS.FONT.weight1;
            pointSize = GLOBALS.FONT.size2;
            leading = GLOBALS.FONT.leading;
            tracking = 25;
            capitalization = Capitalization.allCaps;
            fillTint = 50;
        }

        //Set up "New Code Light" Character Style
        CODE_LIGHT_charStyle = docToSetup.characterStyles.item("New Code Light");
        if(CODE_LIGHT_charStyle.isValid) {
            CODE_LIGHT_charStyle.remove();
        }

        CODE_LIGHT_charStyle = docToSetup.characterStyles.add({name:"New Code Light"});
        with(CODE_LIGHT_charStyle){
            //Formatting the Character text style
            basedOn = "None";
            appliedFont = app.fonts.itemByName(GLOBALS.FONT.family);
            fontStyle = GLOBALS.FONT.weight1;
            pointSize = GLOBALS.FONT.size1;
            leading = GLOBALS.FONT.leading;
            tracking = 0;
            capitalization = Capitalization.normal;
            fillTint = 100;
        }

        //Set up "New Code Bold" Paragraph Style
        CODE_BOLD_paraStyle = docToSetup.paragraphStyles.item("New Code Bold");
        if(CODE_BOLD_paraStyle.isValid) {
            CODE_BOLD_paraStyle.remove();
        }
        
        CODE_BOLD_paraStyle = docToSetup.paragraphStyles.add({name:"New Code Bold"});
        
        with(CODE_BOLD_paraStyle){
            //Formatting the paragraph text style
            nextParagraphStyle = "None";
            appliedFont = app.fonts.itemByName(GLOBALS.FONT.family);
            fontStyle = GLOBALS.FONT.weight2;
            pointSize = GLOBALS.FONT.size1;
            leading = GLOBALS.FONT.leading;
            fillColor = docToSetup.colors.item("Black");
            capitalization = Capitalization.allCaps;

            //Paragraph Rule Settings
            ruleAbove = true;
            ruleAboveLineWeight = GLOBALS.FONT.size1 + " pt";

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
    }

    /*
    Calculate page dimensions (width, height) by using a page's bounds
    A dims object is returned {dims.width, dims.height}
    */
    function calcPageDims(page) {
        var dims = {};
    
        // bounds format: [y1, x1, y2, x2]
        dims.width  = page.bounds[3] - page.bounds[1];
        dims.height = page.bounds[2] - page.bounds[0];

        return dims;
    }

    /* Find narrowest width to be used to calculate bottom slug */
    function findNarrowestWidth(allPages) {
        var narrowest = calcPageDims(allPages[0]).width;
        for (var i = 1; i < allPages.length; i++) {
            var newWidth = calcPageDims(allPages[i]).width;
            narrowest = (newWidth < narrowest) ? newWidth : narrowest;
        }
        return narrowest;
    }

    /* Determine which kind of layout to make & make it */
    function makeLayout(page, pageDims) {
        var currentPage = page;
        var pageWidth = pageDims.width;
        var pageHeight = pageDims.height;
        var bottomWithMargin = pageHeight + bleedValue + 3;

        var maxCol, maxRow;

        if (pageWidth <= GLOBALS.BREAKPOINT.small) {
            makeSmallLayout();
            if(notesCheck.value) addNotes("bottom_row");

        } else if (pageWidth <= GLOBALS.BREAKPOINT.medium) {
            makeRegularLayout();
            if(notesCheck.value) addNotes("bottom");

        } else {
            makeRegularLayout();
            if(notesCheck.value) addNotes("side");
        }


        // Execution functions below

        function makeSmallLayout() {
            var maxRow = 4;
            var titleX = 0;
            var inputX = titleX + 80;
            var y = -144;

            var inputWidth = pageWidth - inputX;
            var inputHeight;

            for (var row = 0; row < maxRow; row++) {
                inputHeight = (row != 4) ? inputBoxData.height : inputBoxData.height * 4;

                titleBoxSetup(titleX, y, titleBoxData.width, titleBoxData.height, titleBoxData[row]);
                inputBoxSetup(inputX, y, inputWidth, inputHeight, inputBoxData[row]);

                // Jump to bottom of page after 2nd row
                y = (row === 1) ? bottomWithMargin : y +  54;
            }
        }

        function makeRegularLayout() {
            var maxCol = 2, maxRow = 2;
            var titleX = 0;
            var inputX = titleX + 80;
            var y;

            var inputWidth, leftoverWidth;
            var inputHeight = inputBoxData.height;

            var counter = 0;
            for (var col = 0; col < maxCol; col++) {
                y = -144;

                if (col < 1) {
                    inputWidth = inputBoxData.width1;
                } else {
                    leftoverWidth = pageWidth - inputX;
                    inputWidth =  (leftoverWidth < inputBoxData.width2) ? leftoverWidth : inputBoxData.width2;
                }

                for (var row = 0; row < maxRow; row++) {
                    titleBoxSetup(titleX, y, titleBoxData.width, titleBoxData.height, titleBoxData[counter]);
                    inputBoxSetup(inputX, y, inputWidth, inputHeight, inputBoxData[counter]);
                    
                    if (counter < 4) counter++;
                    y += 54;
                }

                titleX += 330;
                inputX = titleX + 80;
            }
        }

        function addNotes(location) {
            var titleX, y;
            if (location === "side") {
                titleX = 720;
                y = -144;
            } else if (location === "bottom") {
                titleX = 0;
                y = bottomWithMargin;
            } else if (location === "bottom_row") {
                titleX = 0;
                y = bottomWithMargin + (2 * 54);
            }

            var inputX = titleX + 80;

            var leftoverWidth = pageWidth - inputX;
            var inputWidth = (leftoverWidth < inputBoxData.width3) ? leftoverWidth : inputBoxData.width3;
            var inputHeight = inputBoxData.height * 4;

            titleBoxSetup(titleX, y, titleBoxData.width, titleBoxData.height, titleBoxData[4]);
            inputBoxSetup(inputX, y, inputWidth, inputHeight, inputBoxData[4])
        }

        // Title & input box setup

        function titleBoxSetup(x, y, width, height, content) {
            var titleBox = currentPage.textFrames.add({
                geometricBounds    : [y, x, y + height, x + width],
                appliedObjectStyle : docToSetup.objectStyles.itemByName("SLUG TEXTBOXES")
            });

            titleBox.contents = content;
        }
        
        function inputBoxSetup(x, y, width, height, labelName) {
            var inputBox = currentPage.textFrames.add({
                geometricBounds    : [y, x, y + height, x + width],
                appliedObjectStyle : docToSetup.objectStyles.itemByName("SLUG TEXTBOXES")
            })

            // textFrame is an object, labelName is a string
            if(labelName === "codeInput") {
                var varFileName = docToSetup.textVariables.item("File Name");
                inputBox.textVariableInstances.add({associatedTextVariable:varFileName});
            
            } else if(labelName === "dimsInput") {
                inputBox.contents = (pageWidth / 72) + " × " + (pageHeight / 72) + " in.";
        
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
    }

    /* Apply styles to text boxes */
    function applyStyles() {
        var codeInfoFrames = codeInfoLayer.textFrames;

        for(var z = 0; z < codeInfoFrames.length; z++) {
            codeInfoFrames[z].textFramePreferences.verticalJustification = VerticalJustification.TOP_ALIGN;

            if(codeInfoFrames[z].label === "codeInput") {
                var frameStory = codeInfoFrames[z].parentStory;

                frameStory.appliedCharacterStyle = docToSetup.characterStyles.item("[None]");
                frameStory.appliedParagraphStyle = CODE_BOLD_paraStyle;
                frameStory.justification = Justification.LEFT_ALIGN;
            
            } else if(codeInfoFrames[z].label.indexOf("Input") !== -1 && codeInfoFrames[z].label.indexOf("code") === -1) {
                var frameStory = codeInfoFrames[z].parentStory;

                frameStory.appliedCharacterStyle = CODE_LIGHT_charStyle;
                frameStory.appliedParagraphStyle = docToSetup.paragraphStyles.item("[Basic Paragraph]");
                frameStory.justification = Justification.LEFT_ALIGN;
            
            } else {
                var frameStory = codeInfoFrames[z].parentStory;

                frameStory.appliedCharacterStyle = CODE_NOTE_charStyle;
                frameStory.appliedParagraphStyle = docToSetup.paragraphStyles.item("[Basic Paragraph]");
                frameStory.justification = Justification.RIGHT_ALIGN;
            }
        }
    }
}

/* Set up interface dialog */
function setupDialog() {
    var today = getTodaysDate();

    slugSetupWindow = new Window("dialog", "Panels are CHILL 2.0");

    // Row 1
    var inputRow1 = slugSetupWindow.add("group {alignment: 'left'}");
    
    // Batch
    var batchStaticText = inputRow1.add('statictext {text: "Batch:", size: [65, 24], alignment: "bottom", justify: "left"}');
    batchEditText = inputRow1.add('edittext {text: "1", size: [40, 25], active: true}');
    
    var reviewStaticText = inputRow1.add('statictext {text: "Review:", size: [55, 24], alignment: "bottom", justify: "right"}');
    reviewEditText = inputRow1.add('edittext {text: "1", size: [40, 25]}');

    // Row 1.5
    var inputRow1_5 = slugSetupWindow.add("group {alignment: 'left'}");

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
    var inputRow2 = slugSetupWindow.add("group {alignment: 'left'}");

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
    var inputRow3 = slugSetupWindow.add('group {alignment: "left"}');

    // Date
    var dateStaticText = inputRow3.add("statictext {text: 'Date:', size: [65, 24], alignment: 'bottom', justify: 'left'}");
    dateEditText = inputRow3.add("edittext {size: [155, 25]}");
    dateEditText.text = today;

    // Row 4
    var inputRow4 = slugSetupWindow.add("group {alignment: 'left'}");

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
    var inputRow5 = slugSetupWindow.add("group {alignment: 'left'}");
    var bleedStaticText = inputRow5.add("statictext {text: 'Bleed:', size: [65, 24], alignment: 'bottom', justify: 'left'}");
    var bleedEditText = inputRow5.add("edittext {text: '0.5', size: [65, 25]}");
    var inchStaticText = inputRow5.add("statictext {text: 'in.', size: [65, 24], alignment: 'bottom', justify: 'left'}");
    bleedValue = Number(bleedEditText.text) * 72;

    // Buttons
    var buttonGroup = slugSetupWindow.add("group {alignment: 'right'}");
    var okButton = buttonGroup.add ("button", undefined, "OK");
    var cancelButton = buttonGroup.add ("button", undefined, "Cancel");

    // Disable OK button when bleed value is invalid
    bleedEditText.onChanging = function() {
        bleedValue = Number(bleedEditText.text) * 72; // convert to points right away
        okButton.enabled = (isNaN(bleedValue) || bleedValue < 0) ? false : true;
    }

    function getTodaysDate() {
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];    
        var timeStamp = new Date();
    
        return monthNames[timeStamp.getMonth()] + " " + timeStamp.getDate() + ", " + timeStamp.getFullYear();
    }
}

