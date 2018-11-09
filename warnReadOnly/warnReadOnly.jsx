#target "InDesign-8.0"
#targetengine "session"

app.addEventListener("afterOpen", watchDocument);

function watchDocument() {
  if (!app.layoutWindows.length) return;

  doc = app.activeDocument
  if(doc.readOnly) {
      alert(doc.name + " is read only")
  }
}