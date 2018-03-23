#target "InDesign-8.0"

/*
Relinks all document link to a new folder
Customized for TSHM 100FD
*/

var MODE = "dark"; // change to "light" to replace light panels

var panelFolder = Folder.selectDialog("Pick panel folder");
var relinkFolder = Folder.selectDialog("Pick new link folder");

var panelFiles = panelFolder.getFiles("*.indd");

var badPanels = [];
var writeLog = false; 

// Progress bar
var w = new Window("palette");
w.progressBar = w.add ('progressbar', undefined, 0, panelFiles.length);
w.progressBar.preferredSize.width = 300;
w.show();

for(var j = 0; j < panelFiles.length; j++) {
  var doc = app.open(panelFiles[j], false);
  var badLinks = [];
  var errorHappened = false;
  
  w.progressBar.value = j+1;

  for(var i = 0; i < doc.links.length; i++) {
    var fileName = doc.links[i].name;
    var newLink;

    try {
      if(fileName === "label_24x9.pdf") {    
        newLink = new File(relinkFolder + "/label_24x7_" + MODE + ".pdf");
        doc.links[i].relink(newLink);

      } else if(fileName === "label_9x9.pdf") {
        newLink = new File(relinkFolder + "/label_9x9_dark" + MODE + ".pdf");
        doc.links[i].relink(newLink);
      
      } else if(fileName === "label_11x14.pdf") {    
        newLink = new File(relinkFolder + "/label_11x14.pdf");
        doc.links[i].relink(newLink);
      }
  

    } catch (error) {
      errorHappened = true;
      writeLog = true;
      badLinks.push(gNum);
    }
  }  
  // Log panel code & missing g#s in that panel
  if(errorHappened) {
      var badDoc = doc.name.split(".")[0];
      badPanels.push(badDoc + ": " + badLinks.join(", "));
  }
  
  doc.save();
  doc.close();
}

// Write a .txt log to list panels with missing g#s
if(writeLog) {
    alert("Some images were not re-linked\r See batchRelinkLog.txt on Desktop.");
    
    var logFile = new File("~/Desktop/batchRelinkLog.txt");
    logFile.encoding = "UTF-8";
    
    logFile.open("w");
    logFile.write(badPanels.join("\n"));
    logFile.close();
}