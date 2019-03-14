//Just in case this little script gets lost in the woods:
#target InDesign


//Establish variables for a folder of INDD layout files and each individual files,
//and allow the user to select the folder
var myFolder = Folder.selectDialog("Select Indesign Folder");  
var myInddFiles = myFolder.getFiles("*.indd"); 
 

////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
////// ////// /////  —   D i a l o g   B u s i n e s s    —     ///// ////// //////
////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 

var myWindow = new Window ("dialog", "sLayer");

//Set up text fields
var myInputGroup1 = myWindow.add ("group");
myInputGroup1.alignment = "right";
myInputGroup1.add ("statictext", undefined, "Layer to Kill:");

var textBoxPrompt = "Enter Layer Name Here";

var myTextEditField1 = myInputGroup1.add ("edittext", undefined, textBoxPrompt);
myTextEditField1.characters = 40;
myTextEditField1.active = false;

////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 


//Set up and display the dialog buttons
var myButtonGroup = myWindow.add ("group");
myButtonGroup.alignment = "right";
myButtonGroup.add ("button", undefined, "OK");
myButtonGroup.add ("button", undefined, "Cancel");

//Capture text input
if (myWindow.show () == true) {
var myString1 = myTextEditField1.text;

}
else{
app.dialogs.everyItem().destroy()
}



////// — MAIN Script — //////

//Establish a loop to deal with all the files.
//For each file:

for(k=0; k<myInddFiles.length; k++)  
{  

    //Open the file
    app.open(myInddFiles[k]);

    //Check if myString1” layer exists, and if it does, delete it
    try {
    app.activeDocument.layers.item(myString1).remove();
    }

    catch (whatWeWantIsNotActuallyAnErrorButHeyWeWillTakeIt){
      continue;
    }

    //save file
    app.activeDocument.save();

    //close file
    app.activeDocument.close();


}

var myString = "typeBoss, you just processed " + myInddFiles.length + " files in about 2 seconds. \rNice.";
alert(myString);
