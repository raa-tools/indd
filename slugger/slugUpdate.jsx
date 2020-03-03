#target InDesign

var BADFILESLIST = [];
app.scriptPreferences.measurementUnit = MeasurementUnits.points;

try{
  // These are declared here so they can be used by dialogSetup()
  var myWindow; var batchEditText; var reviewEditText; var dateEditText;
  var batchReviewCheck; var dateCheck;
  var alreadyRun;

  // Run on open file
  if(app.documents.length !== 0) {
    var singleDoc = app.activeDocument;
    dialogSetup();

    // Make sure at least one checkbox is true
    if(myWindow.show() && (batchReviewCheck.value || dateCheck.value)) {
      main(singleDoc);
    } else {
      alert("No updates made!\r Select something to update.");
      app.dialogs.everyItem().destroy()
    }

  // or pick a folder
  } else {
    var panelFolder = Folder.selectDialog("Pick panels");
    var panelFiles = panelFolder.getFiles("*.indd");

    dialogSetup();

    if(myWindow.show() && (batchReviewCheck.value || dateCheck.value)) {
      for(var i = 0; i < panelFiles.length; i++) {
        var panelFile = app.open(panelFiles[i])
        
        main(panelFile);
        panelFile.save();
        panelFile.close();
      }

      if(BADFILESLIST.length !== 0) {
        var date = new Date();
        var now = date.getTime();
        var logFileName = "~/Desktop/slugUpdateLog_" + now +".txt"

        writeLogFile(BADFILESLIST, logFileName)
        alert("Some of the files weren't updated\nCheck " + logFileName);
      }
    } else {
        alert("No updates made!\r Select something to update.");
        app.dialogs.everyItem().destroy()
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
  
  // Batch & Review
  batchReviewCheck = inputRow1.add("checkbox {size: [60, 15], text: '\u00A0Batch:'}");
  batchReviewCheck.onClick = function() {
    if(batchReviewCheck.value) {
      batchEditText.enabled = true;
      reviewEditText.enabled = true;
      fabCheck.enabled = true;
    } else {
      batchEditText.enabled = false;
      reviewEditText.enabled = false;
      fabCheck.enabled = false;
      fabCheck.value = false;
    }
  };

  batchEditText = inputRow1.add('edittext {text: "1", size: [40, 27], enabled: false}');
  
  var reviewStaticText = inputRow1.add('statictext {text: "Review:", size: [55, 25], alignment: "bottom", justify: "right"}');
  reviewEditText = inputRow1.add('edittext {text: "1", size: [40, 27], enabled: false}');


  // Row 2
  var inputRow2 = myWindow.add("group {alignment: 'left'}");

  // TO FABRICATOR
  fabCheck = inputRow2.add("checkbox {size: [65, 15], text: '\u00A0FAB:'}");
  fabCheck.enabled = false;
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
  dateCheck = inputRow3.add("checkbox {size: [60, 15], text: '\u00A0Date:'}");
  dateCheck.onClick = function() {
    if(dateCheck.value) {
      dateEditText.enabled = true;
    
    } else {
      dateEditText.enabled = false;
    }
  }

  dateEditText = inputRow3.add("edittext {size: [155, 27], enabled: false}");
  dateEditText.text = today;
  
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

function main(docToUpdate) {
  var codeInfoLayer = docToUpdate.layers.item("Code and info");

  // TODO: Update dims on every page
  // Currently only captures dims of first page
  var page = docToUpdate.pages[0]
  var width = page.bounds[3] - page.bounds[1]
  var height = page.bounds[2] - page.bounds[0]

  // Log files that have missing "Code and info" layer
  // and continue to next file in the loop
  // (Better than breaking and losing progress)
  if(!codeInfoLayer.isValid) {
    BADFILESLIST.push(docToUpdate.name.replace(".indd", ""));

  } else {
    codeInfoLayer.locked = false;
    codeInfoLayer.move(LocationOptions.BEFORE, docToUpdate.layers[0]);
    
    var codeInfoFrames = codeInfoLayer.textFrames;

    if(batchReviewCheck.value && dateCheck.value) {
      for(var i = 0; i < codeInfoFrames.length; i++) {
        updateBatchReview();
        updateDate();
        updateDims(width, height)
      }
    } else if(batchReviewCheck.value) {
      for(var i = 0; i < codeInfoFrames.length; i++) {
        updateBatchReview();
      }
    } else if(dateCheck.value) {
      for(var i = 0; i < codeInfoFrames.length; i++) {
        updateDate();
      }
    }

    //Re-lock Code and info layer
    docToUpdate.layers.item("Code and info").locked = true;

  }

  function updateBatchReview(){
    if(codeInfoFrames[i].label === "batchReviewInput") {
      if(!fabCheck.value) {
        codeInfoFrames[i].contents = "Batch " + batchEditText.text + " - " + "Review " + reviewEditText.text;  
      } else {
        codeInfoFrames[i].contents = "Batch " + batchEditText.text + " - " + "TO " + fabEditText.text.toUpperCase();
      }
    }
  }

  function updateDate(){
    if(codeInfoFrames[i].label === "dateInput") {
      codeInfoFrames[i].contents = dateEditText.text;
    }
  }

  function updateDims(width, height) {
    if(codeInfoFrames[i].label === "dimsInput") {
      codeInfoFrames[i].contents = Math.round(width / 72 * 100) / 100 + " × " + Math.round(height / 72 * 100) / 100 + "in.";
    }
  }
}

function writeLogFile(listToOutput, fileName){
  var logFile = new File(fileName);
  logFile.encoding = "UTF-8";
  
  logFile.open("w");
  logFile.write("These panels didn't quite work out:\n");
  logFile.write(listToOutput.join("\n"));
  logFile.close();
}
