#target "InDesign-8.0"
#targetengine "session"

app.addEventListener("afterOpen", watchDocument);

function watchDocument() {
  if (!app.layoutWindows.length) return;
  
  var doc = app.activeDocument;
  doc.addEventListener("afterSave", function() {
    doc.addEventListener("beforeClose", function() {
      askForCommitMessage(doc.name)
    })
  })
}

function askForCommitMessage(docName) {
  // Currently this is happening twice per document
  $.writeln(docName + ": closed")
}


