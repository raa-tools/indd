#target InDesign

//Allow the user to select a folder of INDD layout files
//and establish variables for the folder and each individual file,
var myFolder = Folder.selectDialog("*****     Please select a folder of panels     *****");

// Use try/catch in case user cancels out of folder select dialog
try{
    var myInddFiles = myFolder.getFiles("*.indd");
    main();

} catch(error) {
    if(error instanceof TypeError) {
        alert("No folder selected");
    }
}

// Using a main() function so the entire try block above isn't super long...
function main() {
    // These are declared here so they can be used by dialogSetup()
    var myWindow; var dateEditText;

    dialogSetup();

    if(myWindow.show() == true) {
        //Establish a loop to deal with all the files:
        for(k=0; k<myInddFiles.length; k++) {
            var myDocument = app.open(myInddFiles[k]);
            var codeInfoLayer = myDocument.layers.item("Code and info");
    
            if(!codeInfoLayer.isValid) {
                alert("Code and info layer doesn't exist");
                break;
            }
            codeInfoLayer.locked = false;
            codeInfoLayer.move(LocationOptions.BEFORE, myDocument.layers[0]);
            
            var codeInfoFrames = codeInfoLayer.textFrames;

            for(var i = 0; i < codeInfoFrames.length; i++) {
                if(codeInfoFrames[i].label === "dateInput") {
                    codeInfoFrames[i].contents = dateEditText.text;
                }

            }
        
            //Re-lock Code and info layer
            myDocument.layers.item("Code and info").locked = true;

            myDocument.save();
            myDocument.close();
        }
        
        alert("Oh, did you just blink? \rYou missed a lot of fun.\r" + myInddFiles.length + " files processed.");
    
    } else {
        app.dialogs.everyItem().destroy()
    }
    

    function dialogSetup() {
        var today = getTodaysDate();

        myWindow = new Window("dialog", "Panels are CHILL");
        
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
}