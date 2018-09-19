//Just in case this little script gets lost in the woods:
#target InDesign

var BADFILES = [];

//Establish variables for a folder of INDD layout files and each individual files,
//and allow the user to select the folder
var myFolder = Folder.selectDialog("Select Indesign Folder");  
var myInddFiles = myFolder.getFiles("*.indd"); 
 

////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 
////// ////// /////  —   D i a l o g   B u s i n e s s    —     ///// ////// //////
////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 

var myWindow = new Window ("dialog", "pLayer");

//Set up text fields
var inputRow1 = myWindow.add("group {alignment: 'right'}");
var inputRow2 = myWindow.add("group {alignment: 'right'}");

var staticText1 = inputRow1.add ("statictext", undefined, "Layer to Rename");
var staticText2 = inputRow2.add ("statictext", undefined, "New name");

var layerToFindInput = inputRow1.add ("edittext", undefined, "Enter layer name");
var layerToReplaceInput = inputRow2.add ("edittext", undefined, "Enter layer name");

layerToFindInput.characters = 40;
layerToFindInput.active = true;

layerToReplaceInput.characters = 40;

////// ////// ////// ////// ////// ////// ////// ////// ////// ////// ////// 


//Set up and display the dialog buttons
var myButtonGroup = myWindow.add ("group");
myButtonGroup.alignment = "right";
myButtonGroup.add ("button", undefined, "OK");
myButtonGroup.add ("button", undefined, "Cancel");

//Capture text input
if(myWindow.show () == true) {
  var layerToFindName = layerToFindInput.text;
} else {
  app.dialogs.everyItem().destroy()
}

////// — MAIN Script — //////

//Establish a loop to deal with all the files.
//For each file:

for(k=0; k<myInddFiles.length; k++) {  
  app.open(myInddFiles[k]);

  var layerFound = app.activeDocument.layers.item(layerToFindName);

  try {
    layerFound.name = layerToReplaceInput.text;
  } catch (error) {
    BADFILES.push(app.activeDocument.name.replace(".indd", ""));
  }
  


    // catch (whatWeWantIsNotActuallyAnErrorButHeyWeWillTakeIt){
    //     var myString =  layerToFindName + " has vanished like the guy at the hot dog cart." ;
    //     alert(myString);
    
    // }
  app.activeDocument.save();
  app.activeDocument.close();
}

if(BADFILES) alert ("Didn't work on these:\n" + BADFILES.join("\n"))
