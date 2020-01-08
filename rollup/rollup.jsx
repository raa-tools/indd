#target "InDesign-8.0"

function main() {
  var bookFile = File.openDialog("Select .indb file", function(file) {
    return file.name.match(/\.indb/i)
  })

  var destinationFile = new File(bookFile.parent.fullName + "/Untitled.indd")
  destinationFile.saveDlg("Select destination")

  if (bookFile && destinationFile) {
    var book = app.open(bookFile)

    var compiledDoc = compile(book.bookContents)
    compiledDoc.save(destinationFile)
    compiledDoc.close(SaveOptions.NO)

    book.close(SaveOptions.NO)
  }
}

function compile(contents) {
  var targetDoc;
  for (var i = 0; i < contents.length; i++) {
    var fileName = contents[i].fullName
    var docFile = new File(fileName, false)

    if (i === 0) {
      targetDoc = app.open(docFile)
    } else {
      var sourceDoc = app.open(docFile)

      sourceDoc.pages.everyItem().duplicate(LocationOptions.AFTER, targetDoc.pages.item(-1))
      sourceDoc.close(SaveOptions.NO)
    }
  }
  return targetDoc
}

main()
