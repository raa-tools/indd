#target "InDesign-8.0"

function main() {
  var bookFile = File.openDialog("Select .indb file", function(file) {
    // Folders have a file type of undefined,
    // so if file is a real file, only allow .indb
    if (file.type !== undefined) {
      return file.name.match(/\/|\.indb/i)
    }
    return true
  })

  if (!bookFile) return

  var tempDestinationFile = new File(bookFile.parent.fullName + "/Untitled.indd")
  var destinationFile = tempDestinationFile.saveDlg("Select destination")

  if (!destinationFile) return

  var book = app.open(bookFile)

  var compiledDoc = compile(book.bookContents, destinationFile)
  compiledDoc.close(SaveOptions.YES)

  book.close(SaveOptions.NO)
}

function compile(contents, targetFile) {
  var targetDoc;
  for (var i = 0; i < contents.length; i++) {
    var fileName = contents[i].fullName
    var docFile = new File(fileName, false)

    if (i === 0) {
      targetDoc = app.open(docFile)
      targetDoc.save(targetFile)
    } else {
      var sourceDoc = app.open(docFile)

      sourceDoc.pages.everyItem().duplicate(LocationOptions.AFTER, targetDoc.pages.item(-1))
      sourceDoc.close(SaveOptions.NO)
    }
  }
  return targetDoc
}

main()
